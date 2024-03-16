
export default function HamburguerComponent({sidebar}) {
    return (
        <img src="" alt="menu-image" 
        className="w-10 h-10 absolute left-5 top-5 md:invisible mc:visible mc:hover:scale-105 mc:transition mc:duration-200"
        onClick={sidebar}/>
    );
}
