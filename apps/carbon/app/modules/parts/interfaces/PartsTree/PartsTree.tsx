import { Box, Button, HStack, Icon } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AiOutlineCodeSandbox } from "react-icons/ai";
import { BsCaretDownFill } from "react-icons/bs";

type PartsTreeNode = {
  id: string;
  type: "folder" | "file";
  children?: PartsTreeNode[];
};

const data: PartsTreeNode[] = [
  {
    id: "F012345",
    type: "folder",
    children: [
      {
        id: "F505555",
        type: "folder",
      },
      {
        id: "F505556",
        type: "folder",
      },
    ],
  },
];

const PartsTreeExplorer = () => {
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    const map: Record<string, boolean> = {};
    const traverse = (node: PartsTreeNode[]) => {
      node.forEach((n) => {
        map[n.id] = true; // open all nodes by default;
        if (n.children) {
          traverse(n.children);
        }
      });
    };

    traverse(data);
    setExpandedNodes(map);
  }, []);

  const toggleNode = (id: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderPartsTree = (data: PartsTreeNode[], level: number = 0) => {
    return data.map((node) => {
      return (
        <Box display="block" p={0} role="group" key={node.id}>
          <HStack
            alignItems="stretch"
            pl={`calc(${1.5 * level}rem)`}
            borderWidth={2}
            borderStyle="solid"
            borderColor="transparent"
            _active={{
              borderColor: "blue.200",
            }}
          >
            <Button
              variant="ghost"
              aria-label="Expand"
              borderRadius={0}
              size="sm"
              onClick={() => toggleNode(node.id)}
              isDisabled={!node.children}
            >
              <Icon
                as={BsCaretDownFill}
                w={4}
                h={4}
                transition="transform .25s ease"
                transform={
                  expandedNodes[node.id] || !node.children
                    ? undefined
                    : "rotate(-0.25turn)"
                }
              />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<AiOutlineCodeSandbox />}
              borderRadius={0}
              justifyContent="start"
              flex="1 1 0%"
            >
              {node.id}
            </Button>
          </HStack>
          {node.children &&
            expandedNodes[node.id] &&
            renderPartsTree(node.children, level + 1)}
        </Box>
      );
    });
  };

  return <div role="tree">{renderPartsTree(data)}</div>;
};

export default PartsTreeExplorer;
