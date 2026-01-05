interface CredentialCardProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
}

export function CredentialCard({ icon, title, description }: CredentialCardProps) {
  return (
    <div className="flex items-start gap-5 p-3 w-full max-w-sm">
      <div className="w-11 h-11 bg-navaa-accent rounded-full flex items-center justify-center flex-shrink-0 text-white [&_svg]:w-5 [&_svg]:h-5">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-navaa-gray-900 mb-2">{title}</h3>
        {description && (
          <p className="text-base text-navaa-gray-700 leading-relaxed">{description}</p>
        )}
      </div>
    </div>
  );
}
