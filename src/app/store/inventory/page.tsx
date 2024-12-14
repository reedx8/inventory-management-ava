import StoreNavsBar from "@/components/stores-navbar";

export default function Inventory(){
    return (
        <div className="ml-2 mt-6">
            <div>
                <h1 className="text-3xl">Inventory</h1>
            </div>
            <div>
                <StoreNavsBar/>
            </div>
        </div>
    )
}