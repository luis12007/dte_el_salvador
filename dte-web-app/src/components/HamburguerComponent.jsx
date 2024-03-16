import hamburguerimg from '../assets/imgs/hamburguerimg.png';

export default function HamburguerComponent({sidebar}) {
    return (
        <img src={hamburguerimg} alt="menu-image" 
        className="w-8 h-8 absolute left-5 top-5 md:invisible mc:visible mc:hover:scale-105 mc:transition mc:duration-200"
        onClick={sidebar}/>
    );
}
