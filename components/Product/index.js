import useSWR from "swr";
import { useRouter } from "next/router";
import { ProductCard } from "./Product.styled";
import { StyledLink } from "../Link/Link.styled";
import Comments from "../Comments";
import { useState } from "react";
import ProductForm from "../ProductForm";
import { ToolButton } from "./Product.styled";

export default function Product() {
  const router = useRouter();
  const { id } = router.query;

  const { data, isLoading, mutate } = useSWR(`/api/products/${id}`);

  const [isEditMode, setIsEditMode] = useState(false);

  async function handleEditProduct(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const productData = Object.fromEntries(formData);

    const response = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    if (response.ok) {
      mutate();
    } else {
      console.log(response.status);
    }
  }

  async function handleDeleteProduct(id) {
    const response = await fetch(`api/products/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      router.push("/");
    } else {
      console.log(response.status);
    }
  }

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (!data) {
    return;
  }

  return (
    <>
      <ToolButton type="button" onClick={() => setIsEditMode(!isEditMode)}>
        ✏️
      </ToolButton>
      <ToolButton type="button" onClick={() => handleDeleteProduct(id)}>
        🗑️
      </ToolButton>
      {isEditMode && (
        <ProductForm onSubmit={handleEditProduct}>Edit Fish</ProductForm>
      )}
      <ProductCard>
        <h2>{data.name}</h2>
        <p>Description: {data.description}</p>
        <p>
          Price: {data.price} {data.currency}
        </p>
        {data.reviews.length > 0 && <Comments reviews={data.reviews} />}
        <StyledLink href="/">Back to all</StyledLink>
      </ProductCard>
    </>
  );
}
