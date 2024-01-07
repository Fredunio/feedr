import React from "react";
import SectionHeaders from "./SectionHeader";

function HomeAboutSection() {
  return (
    <div id="about" className="py-20">
      <div className="text-center mb-4">
        <SectionHeaders mainHeader={"About Us"} />
      </div>

      <div className="flex flex-col gap-10">
        <p className="text-center text-slate-500">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
          voluptatum, voluptatibus, quas, quod voluptas quia quibusdam
          exercitationem voluptatem quos eum culpa. Quisquam voluptatum,
          voluptatibus, quas, quod voluptas quia quibusdam exercitationem
          voluptatem quos eum culpa.
        </p>
        <p className="text-center text-slate-500">
          Amet aliquip nulla irure eu. Quis qui culpa aliqua voluptate eiusmod
          dolore proident laborum quis aliqua veniam commodo amet culpa.
          Deserunt esse ut Lorem sit Lorem eu ad deserunt consectetur
          exercitation. Dolore et id excepteur ad cillum et laboris sint amet
          labore incididunt reprehenderit velit do. Officia veniam duis officia
          nulla id ipsum. Eiusmod deserunt veniam ad do fugiat ad. Aliquip irure
          quis eiusmod aliqua ullamco sit elit consequat excepteur voluptate.
        </p>
      </div>
    </div>
  );
}

export default HomeAboutSection;
