import React, { FC } from "react";
import Image, { ImageProps } from "next/image";

export interface NcImageProps extends Omit<ImageProps, "alt"> {
  containerClassName?: string;
  alt?: string;
}

const NcImage: FC<NcImageProps> = ({
  containerClassName = "",
  alt = "nc-image",
  className = "object-cover w-full h-full",
  ...args
}) => {
  return (
    <div className={containerClassName}>
      <Image
        className={className}
        alt={alt}
        {...args}
        blurDataURL="/small-placeholder.jpg" // tiny blurred version
      />
    </div>
  );
};

export default NcImage;
