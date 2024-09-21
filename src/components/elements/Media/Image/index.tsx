'use client';

import React from 'react';
import NextImage, { StaticImageData } from 'next/image';

import { BREAKPOINTS } from '@/consts/breakpoints';
import { Props as MediaProps } from '../types';

import classes from './index.module.scss';

export const Image: React.FC<MediaProps> = props => {
  const {
    imgClassName,
    onClick,
    onLoad: onLoadFromProps,
    resource,
    priority,
    fill,
    src: srcFromProps,
    alt: altFromProps,
  } = props;

  const [isLoading, setIsLoading] = React.useState(true);

  let width: number | undefined;
  let height: number | undefined;
  let alt: string | null | undefined = altFromProps;
  let src: StaticImageData | string = srcFromProps || '';

  if (!src && resource && typeof resource !== 'string') {
    const {
      width: fullWidth,
      height: fullHeight,
      filename: fullFilename,
      alt: altFromResource,
    } = resource;

    width = fullWidth ?? undefined;
    height = fullHeight ?? undefined;
    alt = altFromResource;

    const filename = fullFilename;

    src = `${process.env.NEXT_PUBLIC_SERVER_URL}/media/${filename}`;
  }

  // NOTE: this is used by the browser to determine which image to download at different screen sizes
  const sizes = Object.values(BREAKPOINTS)
    .map(value => `(max-width: ${value}px) ${value}px`)
    .join(', ');

  return (
    <NextImage
      className={[isLoading && classes.placeholder, classes.image, imgClassName]
        .filter(Boolean)
        .join(' ')}
      src={src}
      alt={alt || ''}
      onClick={onClick}
      onLoad={() => {
        setIsLoading(false);
        if (typeof onLoadFromProps === 'function') {
          onLoadFromProps();
        }
      }}
      fill={fill}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      sizes={sizes}
      priority={priority}
    />
  );
};
