import React,{useState,useEffect} from "react";
import "./Carousal.css";
/*import { BsArrowLeftCircleFill,BsArrowRightCircleFill } from "react-icons/bs";*/


export const Carousal=({data})=>{
    const [slide,setSlide]=useState(0);

    const nextSlide=()=>
    {
        setSlide(slide==data.length-1?0:slide+1 );
    }

    const prevSlide=()=>{
        setSlide(slide==0?data.length-1:slide-1 );
    }
    useEffect(() => {
  const interval = setInterval(() => {
    setSlide((prev) =>
      prev === data.length - 1 ? 0 : prev + 1
    );
  }, 3000);

  return () => clearInterval(interval);
}, [data.length]);

    return <div className="carousal-container">
        {/* <BsArrowLeftCircleFill className="arrow left-arrow" onClick={prevSlide}/> */}
        {data.map((item, index) => (
            <img key={index} src={item.src} alt={item.alt} className={index === slide ? "slide" : "slide slide-hidden"} />
        ))}
        {/* <BsArrowRightCircleFill className="arrow right-arrow" onClick={nextSlide}/> */}
        <span className="indicator">
            {data.map((_, index) => (
                <button key={index} onClick={() => setSlide(index)} className={index === slide ? "indicate-btn" : "indicate-btn indicate-btn-inactive"}></button>
            ))}
        </span>
    </div>
};
