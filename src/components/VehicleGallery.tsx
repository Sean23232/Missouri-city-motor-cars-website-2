"use client";

import Image from "next/image";
import { useState } from "react";
import { VehiclePhotoPlaceholder } from "@/components/VehiclePhotoPlaceholder";

type GalleryPhoto = { id: number; fileName: string };

type VehicleGalleryProps = {
  title: string;
  truck?: boolean;
  photos: GalleryPhoto[];
};

export function VehicleGallery({ title, truck = false, photos }: VehicleGalleryProps) {
  const [active, setActive] = useState(0);
  const current = photos[active];

  return (
    <div className="vehicle-gallery">
      <div className="vehicle-gallery-main">
        {current ? (
          <Image
            src={`/api/vehicle-images/${current.id}`}
            alt={`${title} photo ${active + 1}`}
            fill
            sizes="(max-width: 850px) 100vw, 58vw"
            priority
            className="gallery-main-photo"
          />
        ) : (
          <VehiclePhotoPlaceholder title={title} truck={truck} large />
        )}
        {photos.length > 0 && <span className="gallery-photo-count">{active + 1} / {photos.length}</span>}
      </div>
      {photos.length > 1 && (
        <div className="vehicle-gallery-thumbnails" aria-label="More vehicle photos">
          {photos.map((photo, index) => (
            <button
              type="button"
              key={photo.id}
              className={`gallery-thumbnail${index === active ? " gallery-thumbnail-active" : ""}`}
              onClick={() => setActive(index)}
              aria-label={`Show photo ${index + 1} of ${photos.length}`}
              aria-pressed={index === active}
            >
              <Image src={`/api/vehicle-images/${photo.id}`} alt="" fill sizes="100px" className="gallery-thumbnail-photo" />
            </button>
          ))}
        </div>
      )}
      {photos.length === 0 && <p className="gallery-pending-note">Vehicle photographs can be added by the dealership.</p>}
    </div>
  );
}
