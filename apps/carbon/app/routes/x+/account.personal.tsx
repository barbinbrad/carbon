import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/router";
import { PageTitle, SectionTitle } from "~/components/Layout";
import { UserAttributesForm } from "~/interfaces/Account/UserAttributes";
import type { PrivateAttributes } from "~/interfaces/Account/types";
import { getPrivateAttributes } from "~/services/account";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { error } from "~/utils/result";

export async function loader({ request }: LoaderArgs) {
  const { client, userId } = await requirePermissions(request, {});

  const [privateAttributes] = await Promise.all([
    getPrivateAttributes(client, userId),
  ]);

  if (privateAttributes.error) {
    return redirect(
      "/x",
      await flash(
        request,
        error(privateAttributes.error, "Failed to get user attributes")
      )
    );
  }

  return json({ attributes: privateAttributes.data });
}

export default function AccountPersonal() {
  const { attributes } = useLoaderData<typeof loader>();
  return (
    <>
      <PageTitle
        title="Personal Data"
        subtitle="This information is private and can only be seen by you and authorized employees."
      />
      {/* <PersonalDataForm personalData={{}} /> */}
      <Accordion w="full" allowMultiple allowToggle>
        {attributes.map((category: PrivateAttributes) => (
          <AccordionItem key={category.id}>
            <AccordionButton>
              <SectionTitle title={category.name} />
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel p={0} pb={4}>
              <UserAttributesForm attributeCategory={category} />
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}
