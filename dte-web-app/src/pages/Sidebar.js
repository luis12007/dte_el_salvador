import GroupComponent from "../components/SideBarComponent";

const Sidebar = () => {
  return (
    <div className="w-full h-[930px] relative bg-steelblue-300 overflow-hidden flex flex-row items-start justify-start pt-[30px] px-3.5 pb-[504px] box-border tracking-[normal]">
      <GroupComponent />
    </div>
  );
};

export default Sidebar;
