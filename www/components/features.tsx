import React from "react";
import { BsLightningCharge } from "react-icons/bs";
import { GiSpeedometer } from "react-icons/gi";
import { GoSync } from "react-icons/go";
import { HiCode, HiFingerPrint } from "react-icons/hi";
import { TbBuildingFactory2 } from "react-icons/tb";

const features = [
  {
    name: "High-Performance",
    icon: GiSpeedometer,
  },
  {
    name: "Open Source",
    icon: HiCode,
  },
  {
    name: "Cloud Native",
    icon: GoSync,
  },
  {
    name: "Single Tenant",
    icon: HiFingerPrint,
  },
  {
    name: "Realtime",
    icon: BsLightningCharge,
  },
  {
    name: "Manufacturing",
    icon: TbBuildingFactory2,
  },
];

function Features() {
  return (
    <>
      <div className="grid grid-cols-2 gap-6 my-12 sm:grid-cols-3 ">
        {features.map(({ icon: Icon, ...feature }, i) => (
          <div
            className="flex items-center p-8 space-x-4 bg-black/[0.07] hover:bg-black/10 dark:bg-zinc-900 dark:hover:bg-zinc-800/50 sm:-inset-x-6 sm:rounded"
            key={feature.name.split(" ").join("-")}
          >
            <div>
              <Icon
                className="block w-8 h-8"
                style={{ height: 24, width: 24 }}
                aria-hidden="true"
              />
            </div>
            <div>
              <div className="my-0 font-medium dark:text-white">
                {feature.name}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Features;
