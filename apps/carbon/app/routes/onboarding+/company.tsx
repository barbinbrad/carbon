import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  HStack,
  VStack,
} from "@carbon/react";
import {
  ValidatedForm,
  validationError,
  validator,
} from "@carbon/remix-validated-form";
import { getLocalTimeZone } from "@internationalized/date";
import { json, redirect, type ActionFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Hidden, Input, Submit } from "~/components/Form";
import { useOnboarding } from "~/hooks";
import {
  getLocationsList,
  insertEmployeeJob,
  upsertLocation,
} from "~/modules/resources";
import {
  getCompany,
  insertCompany,
  onboardingCompanyValidator,
  updateCompany,
} from "~/modules/settings";
import { requirePermissions } from "~/services/auth";
import { assertIsPost } from "~/utils/http";

export async function loader({ request }: ActionFunctionArgs) {
  const { client } = await requirePermissions(request, {
    update: "settings",
  });

  const company = await getCompany(client);
  if (company.error || !company.data) {
    return json({
      company: null,
    });
  }

  return { company: company.data };
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    update: "settings",
  });

  const validation = await validator(onboardingCompanyValidator).validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { next, ...data } = validation.data;

  const [company, locations] = await Promise.all([
    getCompany(client),
    getLocationsList(client),
  ]);

  const location = locations?.data?.[0];

  if (company.data && location) {
    const [companyUpdate, locationUpdate] = await Promise.all([
      updateCompany(client, { ...data, updatedBy: userId }),
      upsertLocation(client, {
        ...location,
        ...data,
        timezone: getLocalTimeZone(),
        updatedBy: userId,
      }),
    ]);
    if (companyUpdate.error) {
      console.error(companyUpdate.error);
      throw new Error("Fatal: failed to update company");
    }
    if (locationUpdate.error) {
      console.error(locationUpdate.error);
      throw new Error("Fatal: failed to update location");
    }
  } else {
    const [companyInsert, locationInsert] = await Promise.all([
      insertCompany(client, data),
      upsertLocation(client, {
        ...data,
        name: "Headquarters",
        timezone: getLocalTimeZone(),
        createdBy: userId,
      }),
    ]);
    if (companyInsert.error) {
      console.error(companyInsert.error);
      throw new Error("Fatal: failed to insert company");
    }
    if (locationInsert.error) {
      console.error(locationInsert.error);
      throw new Error("Fatal: failed to insert location");
    }

    const locationId = locationInsert.data?.id;
    if (!locationId) {
      throw new Error("Fatal: failed to get location ID");
    }

    await insertEmployeeJob(client, {
      id: userId,
      locationId,
    });
  }

  return redirect(next);
}

export default function OnboardingCompany() {
  const { company } = useLoaderData<typeof loader>();
  const { next, previous } = useOnboarding();

  const initialValues = {
    name: company?.name ?? "",
    addressLine1: company?.addressLine1 ?? "",
    city: company?.city ?? "",
    state: company?.state ?? "",
    postalCode: company?.postalCode ?? "",
  };

  return (
    <Card className="max-w-lg">
      <ValidatedForm
        validator={onboardingCompanyValidator}
        defaultValues={initialValues}
        method="post"
      >
        <CardHeader>
          <CardTitle>Now let's setup your company</CardTitle>
          <CardDescription>You can always change this later</CardDescription>
        </CardHeader>
        <CardContent>
          <Hidden name="next" value={next} />
          <VStack spacing={4}>
            <Input autoFocus name="name" label="Company Name" />
            <Input name="addressLine1" label="Address" />
            <Input name="city" label="City" />
            <Input name="state" label="State" />
            <Input name="postalCode" label="Zip Code" />
          </VStack>
        </CardContent>

        <CardFooter>
          <HStack>
            <Button
              variant="solid"
              isDisabled={!previous}
              size="md"
              asChild
              tabIndex={-1}
            >
              <Link to={previous} prefetch="intent">
                Previous
              </Link>
            </Button>
            <Submit>Next</Submit>
          </HStack>
        </CardFooter>
      </ValidatedForm>
    </Card>
  );
}
