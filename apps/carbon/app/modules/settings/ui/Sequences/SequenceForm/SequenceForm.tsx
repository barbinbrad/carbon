import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Heading,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import { useState } from "react";
import { ValidatedForm } from "remix-validated-form";
import { Hidden, Input, Number, Submit } from "~/components/Form";
import { usePermissions } from "~/hooks";
import { sequenceValidator } from "~/modules/settings";
import type { TypeOfValidator } from "~/types/validators";
import { path } from "~/utils/path";
import { interpolateSequenceDate } from "~/utils/string";

type SequenceFormProps = {
  initialValues: TypeOfValidator<typeof sequenceValidator> & {
    name: string;
  };
};

const SequenceForm = ({ initialValues }: SequenceFormProps) => {
  const permissions = usePermissions();
  const navigate = useNavigate();
  const onClose = () => navigate(-1);

  const [prefix, setPrefix] = useState(initialValues.prefix ?? "");
  const [suffix, setSuffix] = useState(initialValues.suffix ?? "");
  const [next, setNext] = useState(initialValues.next ?? "1");
  const [size, setSize] = useState(initialValues.size ?? 5);

  const makePreview = () => {
    const p = interpolateSequenceDate(prefix);
    const s = interpolateSequenceDate(suffix);

    return `${p}${next.toString().padStart(size, "0")}${s}`;
  };

  const isDisabled = !permissions.can("update", "settings");

  return (
    <Drawer onClose={onClose} isOpen={true} size="sm">
      <ValidatedForm
        validator={sequenceValidator}
        method="post"
        action={path.to.tableSequence(initialValues.table)}
        defaultValues={initialValues}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{`${initialValues.name}`} Sequence</DrawerHeader>
          <DrawerBody pb={8}>
            <Hidden name="table" />
            <VStack spacing={4} alignItems="start">
              <Heading size="lg">{makePreview()}</Heading>

              <Input
                name="prefix"
                label="Prefix"
                onChange={(e) => setPrefix(e.target.value)}
              />
              <Number
                name="next"
                min={0}
                label="Next"
                onChange={(_, val) => setNext(val)}
              />
              <Number
                name="size"
                min={0}
                max={30}
                label="Size"
                onChange={(_, val) => setSize(val)}
              />
              <Number name="step" min={0} max={10000} label="Step" />
              <Input
                name="suffix"
                label="Suffix"
                onChange={(e) => setSuffix(e.target.value)}
              />
              <VStack spacing={0} alignItems="start">
                <Text
                  color="gray.500"
                  fontSize="sm"
                >{`%{yyyy} = Full Year`}</Text>
                <Text color="gray.500" fontSize="sm">{`%{yy} = Year`}</Text>
                <Text color="gray.500" fontSize="sm">{`%{mm} = Month`}</Text>
                <Text color="gray.500" fontSize="sm">{`%{dd} = Day`}</Text>
                <Text color="gray.500" fontSize="sm">{`%{hh} = Hour`}</Text>
                <Text color="gray.500" fontSize="sm">{`%{mm} = Minute`}</Text>
                <Text color="gray.500" fontSize="sm">{`%{ss} = Second`}</Text>
              </VStack>
            </VStack>
          </DrawerBody>
          <DrawerFooter>
            <HStack spacing={2}>
              <Submit isDisabled={isDisabled}>Save</Submit>
              <Button
                size="md"
                colorScheme="gray"
                variant="solid"
                onClick={onClose}
              >
                Cancel
              </Button>
            </HStack>
          </DrawerFooter>
        </DrawerContent>
      </ValidatedForm>
    </Drawer>
  );
};

export default SequenceForm;
