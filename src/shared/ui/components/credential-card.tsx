interface CredentialCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function CredentialCard({ icon, title, description }: CredentialCardProps) {
  return (
    <div className="flex items-center gap-3 p-3 w-full max-w-sm">
      <div className="w-8 h-8 bg-navaa-warm-beige rounded-full flex items-center justify-center flex-shrink-0 text-navaa-accent">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-navaa-gray-900 mb-1">{title}</h3>
        <p className="text-xs text-navaa-gray-700">{description}</p>
      </div>
    </div>
  );
}
