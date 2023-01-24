import { useColor, useDebounce, useKeyboardShortcuts } from "@carbon/react";
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
import { Button, Flex, HStack, Kbd } from "@chakra-ui/react";
import { Link, useNavigate } from "@remix-run/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { AiOutlinePartition } from "react-icons/ai";
import { BiListCheck } from "react-icons/bi";
import { BsArrowReturnLeft, BsCartDash, BsCartPlus } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { FaSearch } from "react-icons/fa";
import { HiOutlineDocumentDuplicate } from "react-icons/hi";
import { SiHandshake } from "react-icons/si";
import { useSidebar } from "~/components/Layout/Sidebar/useSidebar";
import { useSupabase } from "~/lib/supabase";
import type { NavItem } from "~/types";

type SearchResult = {
  id: number;
  name: string;
  entity:
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

const SearchModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { supabase } = useSupabase();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 500);

  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const defaultResults = useSidebar();

  const listboxRef = useRef<HTMLUListElement>(null);

  const onResultClick = () => {
    onClose();
    console.log("clearing query");
    setQuery("");
  };

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
      const results =
        debouncedQuery.length === 0 ? defaultResults : searchResults;
      switch (event.code) {
        case "ArrowDown":
          setSelectedIndex((prev) => clip(prev + 1, 0, results.length - 1));
          break;
        case "ArrowUp":
          setSelectedIndex((prev) => clip(prev - 1, 0, results.length - 1));
          break;
        case "Enter":
          const selectedResult = results[selectedIndex];
          if (selectedResult) {
            if ("link" in selectedResult) {
              navigate(selectedResult.link);
            } else {
              navigate(selectedResult.to);
            }
            onClose();
          }
          break;
        default:
          break;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [debouncedQuery.length, navigate, searchResults, selectedIndex]
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
          {(searchResults.length > 0 || debouncedQuery.length === 0) && (
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
                {searchResults.length > 0
                  ? searchResults.map((result, resultIndex) => (
                      <Result
                        key={result.uuid}
                        result={result}
                        selected={selectedIndex === resultIndex}
                        onClick={onResultClick}
                        onHover={() => setSelectedIndex(resultIndex)}
                      />
                    ))
                  : defaultResults.map((item, itemIndex) => (
                      <Module
                        key={item.to}
                        item={item}
                        selected={selectedIndex === itemIndex}
                        onClick={onResultClick}
                        onHover={() => setSelectedIndex(itemIndex)}
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

const resultIconProps = {
  mr: 4,
  w: 8,
  h: 8,
  color: "gray.500",
};

function ResultIcon({ entity }: { entity: SearchResult["entity"] }) {
  switch (entity) {
    case "Customer":
      return <Icon as={SiHandshake} {...resultIconProps} />;
    case "Document":
      return <Icon as={HiOutlineDocumentDuplicate} {...resultIconProps} />;
    case "Job":
      return <Icon as={BiListCheck} {...resultIconProps} />;
    case "Part":
      return <Icon as={AiOutlinePartition} {...resultIconProps} />;
    case "People":
      return <Icon as={CgProfile} {...resultIconProps} />;
    case "Purchase Order":
      return <Icon as={BsCartDash} {...resultIconProps} />;
    case "Sales Order":
      return <Icon as={BsCartPlus} {...resultIconProps} />;
    case "Supplier":
      return <Icon as={SiHandshake} {...resultIconProps} />;
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
  onClick,
  onHover,
}: {
  result: SearchResult;
  selected: boolean;
  onClick: () => void;
  onHover: () => void;
}) {
  const bgColor = useColor("gray.100");
  return (
    <Link to={result.link} onClick={onClick}>
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

function Module({
  item,
  selected,
  onClick,
  onHover,
}: {
  item: NavItem;
  selected: boolean;
  onClick: () => void;
  onHover: () => void;
}) {
  const bgColor = useColor("gray.100");
  return (
    <Link to={item.to} onClick={onClick}>
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
        {/* {item.icon && ( // @ts-expect-error
          <Icon as={item.icon} {...resultIconProps} />
        )} */}
        <VStack alignItems="start" flexGrow={1} spacing={0} w="full">
          <Text fontSize="sm" color="gray.500">
            Module
          </Text>
          <Text fontWeight="bold">{item.name}</Text>
        </VStack>
        <EnterIcon />
      </HStack>
    </Link>
  );
}

const SearchButton = (props: ButtonProps) => {
  const searchModal = useDisclosure();
  useKeyboardShortcuts(
    {
      "/": searchModal.onOpen,
    },
    ["INPUT", "TEXTAREA", "SELECT"]
  );

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

export default SearchButton;
