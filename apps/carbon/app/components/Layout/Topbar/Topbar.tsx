import { useColor, useDebounce } from "@carbon/react";
import { clip } from "@carbon/utils";
import type { ButtonProps } from "@chakra-ui/react";
import {
  Box,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { Button, Flex, GridItem, HStack, Kbd } from "@chakra-ui/react";
import { Link, useNavigate } from "@remix-run/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { AiOutlinePartition } from "react-icons/ai";
import { BiHelpCircle, BiListCheck } from "react-icons/bi";
import { BsArrowReturnLeft, BsCartDash, BsCartPlus } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { FaSearch } from "react-icons/fa";
import { HiOutlineDocumentDuplicate } from "react-icons/hi";
import { SiHandshake } from "react-icons/si";
import { useSupabase } from "~/lib/supabase";
import AvatarMenu from "./AvatarMenu";
import Breadcrumbs from "./Breadcrumbs";
import Logo from "./Logo";
import useBreadcrumbs from "./useBreadcrumbs";

type SearchResult = {
  id: number;
  name: string;
  entity:
    | "Feature"
    | "People"
    | "Customer"
    | "Supplier"
    | "Job"
    | "Part"
    | "Purchase Order"
    | "Sales Order"
    | "Document"
    | null;
  uuid: string | null;
  link: string;
  description: string | null;
};

const Topbar = () => {
  const breadcrumbLinks = useBreadcrumbs();
  const borderColor = useColor("gray.200");

  return (
    <GridItem
      display="grid"
      gap={4}
      gridTemplateColumns="auto 1fr auto 1fr"
      // backdropFilter="auto"
      // backdropBlur="8px"
      bg={useColor("white")}
      borderBottom={1}
      borderBottomColor={borderColor}
      borderBottomStyle="solid"
      position="sticky"
      top={0}
      zIndex={1}
    >
      <Logo />
      <Breadcrumbs links={breadcrumbLinks} />
      <SearchButton />
      <HStack py={2} pr={4} justifyContent="end">
        <Button
          colorScheme="gray"
          leftIcon={<BiHelpCircle />}
          variant="solid"
          border={1}
          borderColor={borderColor}
          borderStyle="solid"
        >
          Help
        </Button>
        <Button
          colorScheme="gray"
          leftIcon={<FaSearch />}
          variant="solid"
          border={1}
          borderColor={borderColor}
          borderStyle="solid"
        >
          Feedback
        </Button>
        <AvatarMenu />
      </HStack>
    </GridItem>
  );
};

const SearchModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const listboxRef = useRef<HTMLUListElement>(null);
  const { supabase } = useSupabase();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 500);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const getSearchResults = useCallback(
    async (q: string) => {
      const tokens = q.split(" ");
      const search =
        tokens.length > 1
          ? tokens.map((token) => `"${token}"`).join(" <-> ")
          : q;

      const result = await supabase
        ?.from("search")
        .select()
        .textSearch("fts", search)
        .limit(20);
      if (result?.data) {
        setSearchResults(result.data);
        return result.data;
      } else {
        setSearchResults([]);
        return [];
      }
    },
    [supabase]
  );

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      switch (event.code) {
        case "ArrowDown":
          setSelectedIndex((prev) =>
            clip(prev + 1, 0, searchResults.length - 1)
          );
          break;
        case "ArrowUp":
          setSelectedIndex((prev) =>
            clip(prev - 1, 0, searchResults.length - 1)
          );
          break;
        case "Enter":
          if (searchResults[selectedIndex]) {
            navigate(searchResults[selectedIndex].link);
          }
          break;
        default:
          break;
      }
    },
    [navigate, searchResults, selectedIndex]
  );

  useEffect(() => {
    if (listboxRef.current) {
      const listbox = listboxRef.current;
      const listboxItems = listbox.querySelectorAll("li");
      const activeItem = listboxItems[selectedIndex];
      if (activeItem) {
        activeItem.scrollIntoView({ block: "nearest" });
      }
    }
  }, [searchResults, selectedIndex]);

  useEffect(() => {
    setSelectedIndex(0);
    if (debouncedQuery) {
      getSearchResults(debouncedQuery);
    } else {
      setSearchResults([]);
    }
  }, [debouncedQuery, getSearchResults]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setQuery("");
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalBody p={0}>
          <InputGroup size="lg">
            <InputLeftElement
              pointerEvents="none"
              children={<Icon as={FaSearch} color="gray.500" />}
            />
            <Input
              placeholder="Search..."
              value={query}
              variant="flushed"
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              _focus={{
                borderBottomColor: "transparent",
                boxShadow: "none",
                outline: "none",
              }}
            />
          </InputGroup>
          {searchResults.length > 0 && (
            <Box
              bg="white"
              borderBottomRadius="lg"
              boxShadow="lg"
              maxH="66vh"
              overflowY="scroll"
              px={4}
              pt={0}
              pb={4}
            >
              <List role="listbox" ref={listboxRef}>
                {searchResults.map((result, resultIndex) => (
                  <Result
                    key={result.uuid}
                    result={result}
                    selected={selectedIndex === resultIndex}
                    onHover={() => setSelectedIndex(resultIndex)}
                  />
                ))}
              </List>
            </Box>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

function ResultIcon({ entity }: { entity: SearchResult["entity"] }) {
  const defaultProps = {
    mr: 4,
    w: 8,
    h: 8,
    color: "gray.500",
  };

  switch (entity) {
    case "Customer":
      return <Icon as={SiHandshake} {...defaultProps} />;
    case "Document":
      return <Icon as={HiOutlineDocumentDuplicate} {...defaultProps} />;
    case "Job":
      return <Icon as={BiListCheck} {...defaultProps} />;
    case "Part":
      return <Icon as={AiOutlinePartition} {...defaultProps} />;
    case "People":
      return <Icon as={CgProfile} {...defaultProps} />;
    case "Purchase Order":
      return <Icon as={BsCartDash} {...defaultProps} />;
    case "Sales Order":
      return <Icon as={BsCartPlus} {...defaultProps} />;
    case "Supplier":
      return <Icon as={SiHandshake} {...defaultProps} />;
    default:
      return null;
  }
}

function EnterIcon() {
  return <Icon h={6} w={6} color="gray.500" as={BsArrowReturnLeft} />;
}

function Result({
  result,
  selected,
  onHover,
}: {
  result: SearchResult;
  selected: boolean;
  onHover: () => void;
}) {
  const bgColor = useColor("gray.100");
  return (
    <Link to={result.link}>
      <HStack
        as={ListItem}
        role="option"
        bg={selected ? "gray.900" : bgColor}
        borderRadius="lg"
        color={selected ? "white" : undefined}
        minH={16}
        mt={2}
        px={4}
        py={2}
        onMouseOver={onHover}
        _hover={{
          bg: "gray.900",
          color: "white",
        }}
      >
        <ResultIcon entity={result.entity} />
        <VStack alignItems="start" flexGrow={1} spacing={0} w="full">
          <Text fontSize="sm" color="gray.500">
            {result.entity}
          </Text>
          <Text fontWeight="bold">{result.name}</Text>
        </VStack>
        <EnterIcon />
      </HStack>
    </Link>
  );
}

const SearchButton = (props: ButtonProps) => {
  const searchModal = useDisclosure();

  return (
    <>
      <Button
        colorScheme="gray"
        leftIcon={<FaSearch />}
        variant="outline"
        boxShadow="sm"
        color="gray.500"
        w={200}
        mt={2}
        onClick={searchModal.onOpen}
        {...props}
      >
        <HStack w="full">
          <Flex flexGrow={1}>Search</Flex>
          <Kbd size="lg">/</Kbd>
        </HStack>
      </Button>
      <SearchModal isOpen={searchModal.isOpen} onClose={searchModal.onClose} />
    </>
  );
};

export default Topbar;
