import StoreNavsBar from "@/components/stores-navbar";

export default function Stores() {
  return (
    <div className="ml-2 mt-6">
      <div>
        <h1 className="text-3xl">Store</h1>
      </div>
      <div>
        <StoreNavsBar/>
      </div>
    </div>
  );
}