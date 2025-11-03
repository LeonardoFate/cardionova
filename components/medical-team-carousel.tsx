"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Stethoscope } from "lucide-react";

interface Doctor {
  name: string;
  specialty: string;
  description: string;
  formation: string;
  certifications: string[];
}

interface MedicalTeamCarouselProps {
  doctors: Doctor[];
}

export function MedicalTeamCarousel({ doctors }: MedicalTeamCarouselProps) {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full max-w-6xl mx-auto"
    >
      <CarouselContent>
        {doctors.map((doctor, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <Card className="hover:shadow-lg transition-shadow h-full">
                <CardHeader>
                  <div className="w-24 h-24 bg-gradient-to-br from-[#1E3A8A]/20 to-[#E11D48]/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Stethoscope className="w-12 h-12 text-[#E11D48]" />
                  </div>
                  <CardTitle className="text-xl text-[#1E3A8A] text-center">
                    {doctor.name}
                  </CardTitle>
                  <p className="text-[#E11D48] font-semibold text-center">
                    {doctor.specialty}
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-gray-600 text-sm">{doctor.description}</p>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                      Formación:
                    </p>
                    <p className="text-sm text-gray-600">{doctor.formation}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Certificaciones:
                    </p>
                    <ul className="space-y-1">
                      {doctor.certifications.map((cert, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-[#E11D48] mt-1">•</span>
                          <span>{cert}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden md:flex" />
      <CarouselNext className="hidden md:flex" />
    </Carousel>
  );
}
