import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Car, Plus, Edit, Trash2, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: string;
  color: string;
  licensePlate: string;
  isDefault: boolean;
}

const VehicleManager = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: "1",
      make: "Honda",
      model: "City",
      year: "2020",
      color: "White",
      licensePlate: "ABC-123",
      isDefault: true,
    },
    {
      id: "2",
      make: "Toyota",
      model: "Corolla",
      year: "2018",
      color: "Silver",
      licensePlate: "XYZ-789",
      isDefault: false,
    },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle | null>(null);
  const [newVehicle, setNewVehicle] = useState<
    Omit<Vehicle, "id" | "isDefault">
  >({
    make: "",
    model: "",
    year: "",
    color: "",
    licensePlate: "",
  });

  const handleAddVehicle = () => {
    const vehicle: Vehicle = {
      id: Date.now().toString(),
      ...newVehicle,
      isDefault: vehicles.length === 0, // Make default if it's the first vehicle
    };

    setVehicles([...vehicles, vehicle]);
    setNewVehicle({
      make: "",
      model: "",
      year: "",
      color: "",
      licensePlate: "",
    });
    setIsAddDialogOpen(false);
  };

  const handleEditVehicle = () => {
    if (!currentVehicle) return;

    const updatedVehicles = vehicles.map((vehicle) =>
      vehicle.id === currentVehicle.id ? currentVehicle : vehicle,
    );

    setVehicles(updatedVehicles);
    setIsEditDialogOpen(false);
    setCurrentVehicle(null);
  };

  const handleDeleteVehicle = (id: string) => {
    const updatedVehicles = vehicles.filter((vehicle) => vehicle.id !== id);

    // If we deleted the default vehicle and there are other vehicles, make the first one default
    if (
      vehicles.find((v) => v.id === id)?.isDefault &&
      updatedVehicles.length > 0
    ) {
      updatedVehicles[0].isDefault = true;
    }

    setVehicles(updatedVehicles);
  };

  const handleSetDefault = (id: string) => {
    const updatedVehicles = vehicles.map((vehicle) => ({
      ...vehicle,
      isDefault: vehicle.id === id,
    }));

    setVehicles(updatedVehicles);
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5 text-primary" />
          Your Vehicles
        </CardTitle>
        <CardDescription>
          Manage your vehicles for quick ride creation
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {vehicles.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <Car className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900">
                No vehicles added yet
              </h3>
              <p className="text-gray-500 mt-1 mb-4">
                Add your vehicle details to quickly create rides
              </p>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" /> Add Vehicle
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Vehicle</DialogTitle>
                    <DialogDescription>
                      Enter your vehicle details below
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="make">Make</Label>
                        <Input
                          id="make"
                          placeholder="e.g. Toyota"
                          value={newVehicle.make}
                          onChange={(e) =>
                            setNewVehicle({
                              ...newVehicle,
                              make: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="model">Model</Label>
                        <Input
                          id="model"
                          placeholder="e.g. Corolla"
                          value={newVehicle.model}
                          onChange={(e) =>
                            setNewVehicle({
                              ...newVehicle,
                              model: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="year">Year</Label>
                        <Input
                          id="year"
                          placeholder="e.g. 2020"
                          value={newVehicle.year}
                          onChange={(e) =>
                            setNewVehicle({
                              ...newVehicle,
                              year: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="color">Color</Label>
                        <Input
                          id="color"
                          placeholder="e.g. White"
                          value={newVehicle.color}
                          onChange={(e) =>
                            setNewVehicle({
                              ...newVehicle,
                              color: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="licensePlate">License Plate</Label>
                      <Input
                        id="licensePlate"
                        placeholder="e.g. ABC-123"
                        value={newVehicle.licensePlate}
                        onChange={(e) =>
                          setNewVehicle({
                            ...newVehicle,
                            licensePlate: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddVehicle}>Add Vehicle</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <>
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Car className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">
                          {vehicle.make} {vehicle.model} ({vehicle.year})
                        </h3>
                        {vehicle.isDefault && (
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200"
                          >
                            Default
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        <span className="inline-block mr-3">
                          Color: {vehicle.color}
                        </span>
                        <span>License: {vehicle.licensePlate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3 sm:mt-0">
                    {!vehicle.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(vehicle.id)}
                      >
                        <Check className="h-4 w-4 mr-1" /> Set Default
                      </Button>
                    )}
                    <Dialog
                      open={
                        isEditDialogOpen && currentVehicle?.id === vehicle.id
                      }
                      onOpenChange={(open) => {
                        setIsEditDialogOpen(open);
                        if (!open) setCurrentVehicle(null);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setCurrentVehicle(vehicle)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Vehicle</DialogTitle>
                          <DialogDescription>
                            Update your vehicle details
                          </DialogDescription>
                        </DialogHeader>

                        {currentVehicle && (
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-make">Make</Label>
                                <Input
                                  id="edit-make"
                                  value={currentVehicle.make}
                                  onChange={(e) =>
                                    setCurrentVehicle({
                                      ...currentVehicle,
                                      make: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-model">Model</Label>
                                <Input
                                  id="edit-model"
                                  value={currentVehicle.model}
                                  onChange={(e) =>
                                    setCurrentVehicle({
                                      ...currentVehicle,
                                      model: e.target.value,
                                    })
                                  }
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-year">Year</Label>
                                <Input
                                  id="edit-year"
                                  value={currentVehicle.year}
                                  onChange={(e) =>
                                    setCurrentVehicle({
                                      ...currentVehicle,
                                      year: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-color">Color</Label>
                                <Input
                                  id="edit-color"
                                  value={currentVehicle.color}
                                  onChange={(e) =>
                                    setCurrentVehicle({
                                      ...currentVehicle,
                                      color: e.target.value,
                                    })
                                  }
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="edit-licensePlate">
                                License Plate
                              </Label>
                              <Input
                                id="edit-licensePlate"
                                value={currentVehicle.licensePlate}
                                onChange={(e) =>
                                  setCurrentVehicle({
                                    ...currentVehicle,
                                    licensePlate: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                        )}

                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setIsEditDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleEditVehicle}>
                            Save Changes
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteVehicle(vehicle.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full mt-4">
                    <Plus className="h-4 w-4 mr-2" /> Add Another Vehicle
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Vehicle</DialogTitle>
                    <DialogDescription>
                      Enter your vehicle details below
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="make">Make</Label>
                        <Input
                          id="make"
                          placeholder="e.g. Toyota"
                          value={newVehicle.make}
                          onChange={(e) =>
                            setNewVehicle({
                              ...newVehicle,
                              make: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="model">Model</Label>
                        <Input
                          id="model"
                          placeholder="e.g. Corolla"
                          value={newVehicle.model}
                          onChange={(e) =>
                            setNewVehicle({
                              ...newVehicle,
                              model: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="year">Year</Label>
                        <Input
                          id="year"
                          placeholder="e.g. 2020"
                          value={newVehicle.year}
                          onChange={(e) =>
                            setNewVehicle({
                              ...newVehicle,
                              year: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="color">Color</Label>
                        <Input
                          id="color"
                          placeholder="e.g. White"
                          value={newVehicle.color}
                          onChange={(e) =>
                            setNewVehicle({
                              ...newVehicle,
                              color: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="licensePlate">License Plate</Label>
                      <Input
                        id="licensePlate"
                        placeholder="e.g. ABC-123"
                        value={newVehicle.licensePlate}
                        onChange={(e) =>
                          setNewVehicle({
                            ...newVehicle,
                            licensePlate: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddVehicle}>Add Vehicle</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleManager;
