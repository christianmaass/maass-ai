import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../Button';

interface CourseCardProps {
  title: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  href: string;
}

export function CourseCard({ title, description, imageUrl, buttonText, href }: CourseCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
      <div className="relative aspect-square rounded-t-xl overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill={true}
          className="object-cover block"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-navaa-gray-900 mb-2">{title}</h3>
        <p className="text-navaa-gray-700 text-sm mb-4 flex-grow">{description}</p>
        <Link href={href}>
          <Button className="w-full bg-navaa-accent text-white hover:bg-navaa-accent/80 transition-colors duration-200">
            {buttonText}
          </Button>
        </Link>
      </div>
    </div>
  );
}
