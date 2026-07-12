import { MaterialList } from "@/widgets/MaterialList/ui/MaterialList/material-list";
import { AddMaterial } from "@/features/material/create-material/ui";

const Materials = () => {
  return (
    <>
      <AddMaterial />
      <MaterialList />
    </>
  );
};

export default Materials;
