import Image from 'next/image';

/**
 * Basic hero banner with title and text content only
 */
interface BasicHeroBannerProps {
  /** Main heading text */
  title: string;
  /** Descriptive text content */
  text: string;
}

/**
 * Hero banner with image support
 */
interface HeroBannerWithImageProps {
  /** Main heading text */
  title: string;
  /** Descriptive text content */
  text: string;
  /** URL of the hero image */
  imageUrl: string;
  /** Alt text for the hero image */
  imageAlt: string;
  /** Whether the image should be loaded with priority */
  priority?: boolean;
}

/**
 * Basic hero banner component with title and text content
 * Use this for simple hero sections without images
 */
export function HeroBanner({ title, text }: BasicHeroBannerProps) {
  return (
    <div className="w-full text-left">
      <h1 className="text-4xl lg:text-5xl font-bold text-navaa-gray-900 mb-6 leading-tight">
        {title}
      </h1>
      <p className="text-lg md:text-xl text-navaa-gray-700 leading-relaxed max-w-2xl">{text}</p>
    </div>
  );
}

/**
 * Hero banner component with image support
 * Use this for hero sections that need an accompanying image
 */
export function HeroBannerWithImage({
  title,
  text,
  imageUrl,
  imageAlt,
  priority = true,
}: HeroBannerWithImageProps) {
  return (
    <div className="w-full flex flex-col lg:flex-row items-center justify-between">
      {/* Left side - Text content */}
      <div className="w-full lg:w-1/2 text-left z-10">
        <h1 className="text-4xl lg:text-5xl font-bold text-navaa-gray-900 mb-6 leading-tight">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-navaa-gray-700 leading-relaxed max-w-2xl">{text}</p>
      </div>

      {/* Right side - Image */}
      <div className="relative w-full lg:w-1/2 h-[400px] lg:h-[500px] mt-8 lg:mt-0">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill={true}
          priority={priority}
          loading={priority ? undefined : 'lazy'}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain object-bottom"
        />
      </div>
    </div>
  );
}
