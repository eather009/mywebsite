import Image from "next/image";

const PROFILE_SRC = "/images/eather-profile-v4.png?v=3";

export function ProfilePhoto({ className = "" }: { className?: string }) {
  return (
    <div className={`profile-photo-wrap ${className}`}>
      <div className="profile-photo-backdrop" aria-hidden="true">
        <div className="profile-photo-ring" />
        <div className="profile-photo-glow" />
      </div>
      <div className="profile-photo-frame">
        <Image
          src={PROFILE_SRC}
          alt="Iftekhar Ahmed Eather — Team Lead and System Engineer"
          width={852}
          height={1272}
          priority
          unoptimized
          sizes="(max-width: 768px) 85vw, (max-width: 1024px) 45vw, 480px"
          className="profile-photo"
        />
      </div>
    </div>
  );
}
