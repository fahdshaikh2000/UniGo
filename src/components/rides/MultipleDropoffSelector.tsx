import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Plus, X, DragVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DropoffPoint {
  id: string;
  location: string;
  order: number;
}

interface MultipleDropoffSelectorProps {
  onChange?: (dropoffPoints: DropoffPoint[]) => void;
  maxDropoffs?: number;
}

const MultipleDropoffSelector = ({
  onChange = () => {},
  maxDropoffs = 5,
}: MultipleDropoffSelectorProps) => {
  const [dropoffPoints, setDropoffPoints] = useState<DropoffPoint[]>([
    { id: "1", location: "", order: 1 },
  ]);

  const handleAddDropoff = () => {
    if (dropoffPoints.length >= maxDropoffs) return;

    const newDropoff: DropoffPoint = {
      id: Date.now().toString(),
      location: "",
      order: dropoffPoints.length + 1,
    };

    const updatedDropoffs = [...dropoffPoints, newDropoff];
    setDropoffPoints(updatedDropoffs);
    onChange(updatedDropoffs);
  };

  const handleRemoveDropoff = (id: string) => {
    if (dropoffPoints.length <= 1) return;

    const updatedDropoffs = dropoffPoints
      .filter((point) => point.id !== id)
      .map((point, index) => ({ ...point, order: index + 1 }));

    setDropoffPoints(updatedDropoffs);
    onChange(updatedDropoffs);
  };

  const handleLocationChange = (id: string, location: string) => {
    const updatedDropoffs = dropoffPoints.map((point) =>
      point.id === id ? { ...point, location } : point,
    );

    setDropoffPoints(updatedDropoffs);
    onChange(updatedDropoffs);
  };

  const moveDropoff = (fromIndex: number, toIndex: number) => {
    if (
      fromIndex < 0 ||
      fromIndex >= dropoffPoints.length ||
      toIndex < 0 ||
      toIndex >= dropoffPoints.length
    )
      return;

    const updatedDropoffs = [...dropoffPoints];
    const [movedItem] = updatedDropoffs.splice(fromIndex, 1);
    updatedDropoffs.splice(toIndex, 0, movedItem);

    // Update order numbers
    const reorderedDropoffs = updatedDropoffs.map((point, index) => ({
      ...point,
      order: index + 1,
    }));

    setDropoffPoints(reorderedDropoffs);
    onChange(reorderedDropoffs);
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Multiple Drop-off Points
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Add multiple drop-off locations if you're willing to drop passengers
            at different points along your route.
          </p>

          <div className="space-y-3">
            {dropoffPoints.map((point, index) => (
              <div
                key={point.id}
                className="flex items-center gap-2 p-2 rounded-md border border-gray-200 bg-gray-50"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium">
                  {point.order}
                </div>

                <div className="flex-1">
                  <Label htmlFor={`dropoff-${point.id}`} className="sr-only">
                    Drop-off Location {point.order}
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      id={`dropoff-${point.id}`}
                      placeholder={`Drop-off location ${point.order}`}
                      className="pl-10"
                      value={point.location}
                      onChange={(e) =>
                        handleLocationChange(point.id, e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {index > 0 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => moveDropoff(index, index - 1)}
                    >
                      <span className="sr-only">Move up</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m18 15-6-6-6 6" />
                      </svg>
                    </Button>
                  )}

                  {index < dropoffPoints.length - 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => moveDropoff(index, index + 1)}
                    >
                      <span className="sr-only">Move down</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleRemoveDropoff(point.id)}
                    disabled={dropoffPoints.length <= 1}
                  >
                    <span className="sr-only">Remove</span>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={handleAddDropoff}
              disabled={dropoffPoints.length >= maxDropoffs}
            >
              <Plus className="h-4 w-4" />
              Add Drop-off Point
            </Button>

            <Badge variant="outline" className="text-xs">
              {dropoffPoints.length}/{maxDropoffs} points
            </Badge>
          </div>

          <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700">
            <p>
              <strong>Tip:</strong> Order your drop-off points in the sequence
              you plan to visit them. Passengers will see this information when
              booking.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MultipleDropoffSelector;
