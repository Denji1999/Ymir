import type { NextApiRequest, NextApiResponse } from "next";

/*
Static catalog for demo. Place images in /public/images/shop/
*/
const items = [
  { id: "p1", name: "ODM Gas Canister", price: 100, image: "/images/shop/gas.png" },
  { id: "p2", name: "Scout Cloak", price: 250, image: "/images/shop/cloak.png" },
  { id: "p3", name: "Titan Serum", price: 1000000, image: "/images/shop/serum.png" }
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();
  res.json({ items });
}
