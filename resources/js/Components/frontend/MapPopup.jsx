import { categoryColors } from "@/Utils/Constants";
import { toIDR } from "@/Utils/helper";
export default function MapPopup({ location }) {
    return (
            <div className="font-poppins">
                <div>
                    <p className={`txt-sm text-white font-semibold px-5 py-2.5 rounded-full w-fit ${categoryColors[location.category.id]

                    }`}>
                        {location.category.name}
                    </p>
                </div>
                <div className="px-2.5">
                    <div className="flex justify-between items-end mt-5 text-lg font-semibold">
                        <p className="!m-0">{location.title}</p>
                        <div>
                            <p className="text-primary-opaque text-right !m-0">
                                {toIDR(location.start_from)}
                            </p>
                        </div>
                 </div>
                </div>
                <div className="text-sm text-gray-400 flex items-center gap-2 font-semibold">
                    <i className="bi bi-clock-fill"></i>
                    <p className="!m-0">{location.officehours}</p>
                </div>
                <hr className="my-4 border-gray-300"/>
                <p className="text-wrap line-clamp-2 text-sm text-gray-400 font-medium map-popup"
                dangerouslySetInnerHTML={{__html: location.description }}
                ></p>
            </div>
    );
}
