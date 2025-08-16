import ProductCard from "@/components/productCard";
import { prisma } from "@/lib/db/prisma";
import { Metadata } from "next";

interface SearchPageProps {
  searchParams: Promise<{ query: string }>;
}

export async function generateMetadata(
  props: SearchPageProps,
): Promise<Metadata> {
  const searchParams = await props.searchParams;

  const { query } = searchParams;

  return {
    title: `Search: ${query} - eShop`,
  };
}

export default async function SearchPage(props: SearchPageProps) {
  const searchParams = await props.searchParams;

  const { query } = searchParams;

  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    },
    orderBy: { id: "desc" },
  });

  if (products.length === 0) {
    return <div className="text-center">No products found.</div>;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard product={product} key={product.id} />
      ))}
    </div>
  );
}
