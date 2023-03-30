import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useCallback } from "react";
import type { Connection, Node, Edge } from "reactflow";
import ReactFlow, {
  Controls,
  Background,
  BackgroundVariant,
  addEdge,
  useNodesState,
  useEdgesState,
} from "reactflow";
import reactFlowStyles from "reactflow/dist/style.css";
import { requirePermissions } from "~/services/auth";

export const meta: MetaFunction = () => ({
  title: "Carbon | Parts",
});

export function links() {
  return [{ rel: "stylesheet", href: reactFlowStyles }];
}

export async function loader({ request }: LoaderArgs) {
  await requirePermissions(request, {
    view: "parts",
  });

  const nodes: Node[] = [
    {
      id: "1",
      data: { label: "Node 1" },
      position: { x: 250, y: 5 },
      type: "input",
    },
    {
      id: "2",
      data: { label: "Node 2" },
      position: { x: 100, y: 100 },
    },
    {
      id: "3",
      data: { label: "Node 3" },
      position: { x: 400, y: 100 },
    },
    {
      id: "4",
      data: { label: "Node 4" },
      position: { x: 400, y: 200 },
      type: "output",
    },
  ];

  const edges: Edge[] = [
    { id: "e1-2", source: "1", target: "2", animated: true },
    { id: "e1-3", source: "1", target: "3", animated: true },
  ];

  return json({ nodes, edges });
}

export default function PartsRoute() {
  const data = useLoaderData<typeof loader>();

  const [nodes, , onNodesChange] = useNodesState(data.nodes as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(data.edges as Edge[]);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <ReactFlow
      fitView
      nodes={nodes}
      edges={edges}
      onConnect={onConnect}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
    >
      <Background variant={BackgroundVariant.Lines} gap={16} size={1} />
      <Controls />
    </ReactFlow>
  );
}
