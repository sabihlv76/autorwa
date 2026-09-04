import type { Seller } from "@/types/product";

export const mockSellers: Seller[] = [
  {
    id: "seller-kigali-motors",
    name: "Kigali Motors",
    verified: true,
    location: "Kigali, Gasabo",
    whatsapp: "+250788100001",
    enterprise: true,
    rating: 4.7,
  },
  {
    id: "seller-rwanda-auto-parts",
    name: "Rwanda Auto Parts",
    verified: true,
    location: "Kigali, Nyarugenge",
    whatsapp: "+250788100002",
    enterprise: true,
    rating: 4.3,
  },
  {
    id: "seller-musanze-cars",
    name: "Musanze Cars Ltd",
    verified: true,
    location: "Musanze",
    whatsapp: "+250788100003",
    rating: 4.0,
  },
  {
    id: "seller-huye-spares",
    name: "Huye Spares Hub",
    verified: false,
    location: "Huye",
    whatsapp: "+250788100004",
  },
  {
    id: "seller-private-jclaude",
    name: "J. Claude (Private Seller)",
    verified: false,
    location: "Kigali, Kicukiro",
    whatsapp: "+250788100005",
  },
  {
    id: "seller-rubavu-motors",
    name: "Rubavu Motors",
    verified: true,
    location: "Rubavu",
    whatsapp: "+250788100006",
  },
];

export function getSellerById(id: string): Seller | undefined {
  return mockSellers.find((seller) => seller.id === id);
}
