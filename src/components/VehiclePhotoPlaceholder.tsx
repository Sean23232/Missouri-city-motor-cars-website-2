type VehiclePhotoPlaceholderProps = {
  title: string;
  truck?: boolean;
  large?: boolean;
};

export function VehiclePhotoPlaceholder({ title, truck = false, large = false }: VehiclePhotoPlaceholderProps) {
  return (
    <div
      className={`vehicle-placeholder${truck ? " vehicle-placeholder-truck" : ""}${large ? " vehicle-placeholder-large" : ""}`}
      role="img"
      aria-label={`${title} listing photo has not been added yet`}
    >
      <span className="photo-pending-label">PHOTOS COMING SOON</span>
      <svg className="placeholder-car-art" viewBox="0 0 760 340" aria-hidden="true">
        {truck ? (
          <>
            <path
              className="placeholder-car-fill"
              d="M103 231 121 196q9-19 31-23l59-9 65-72q13-15 35-15h174q19 0 31 16l48 68 72 17q22 6 28 28l10 36H102Z"
            />
            <path className="placeholder-car-line" d="m238 164 54-61q9-10 24-10h77v76H238Zm171-71h75q12 0 20 11l42 60H409V93Zm-294 139h543" />
          </>
        ) : (
          <>
            <path
              className="placeholder-car-fill"
              d="M107 230 125 198q10-18 31-24l68-18 67-58q15-13 35-13h170q20 0 34 15l48 57 57 17q22 7 29 28l10 33H107Z"
            />
            <path className="placeholder-car-line" d="m241 161 62-53q10-9 24-9h86v70H241Zm187-62h68q13 0 22 10l40 60H428V99ZM109 231h558" />
          </>
        )}
        <path className="placeholder-car-line" d="M154 230v24m458-24v24" />
        <circle className="placeholder-wheel" cx="221" cy="237" r="37" />
        <circle className="placeholder-wheel-inner" cx="221" cy="237" r="17" />
        <circle className="placeholder-wheel" cx="550" cy="237" r="37" />
        <circle className="placeholder-wheel-inner" cx="550" cy="237" r="17" />
        <path className="placeholder-car-line" d="M127 197h34m444 0h31" />
      </svg>
      <span className="placeholder-photo-caption">Actual vehicle photographs will appear here</span>
      <span className="placeholder-brand-caption">MISSOURI CITY MOTOR CARS</span>
    </div>
  );
}
