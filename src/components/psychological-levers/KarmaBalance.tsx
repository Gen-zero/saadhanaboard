import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Heart, 
  Shield, 
  Gift, 
  Users, 
  BookOpen, 
  ShoppingCart,
  Plus,
  Minus,
  Repeat
} from "lucide-react";
import { usePsychologicalLevers } from "@/hooks/usePsychologicalLevers";
import { useUserProgression } from "@/hooks/useUserProgression";
import { toast } from "@/hooks/use-toast";

const KarmaBalance = () => {
  const { psychologicalProfile, addKarmaPoints, donateKarmaPoints, convertKarmaToSpiritualPoints } = usePsychologicalLevers();
  const { progression, addSpiritualPoints } = useUserProgression();
  const [donationAmount, setDonationAmount] = useState("");
  const [conversionAmount, setConversionAmount] = useState("");
  const [isDonating, setIsDonating] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

  const handleDonate = () => {
    const amount = parseInt(donationAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid donation amount",
        variant: "destructive"
      });
      return;
    }
    
    if (amount > psychologicalProfile.karmaBalance.total) {
      toast({
        title: "Insufficient Karma",
        description: "You don't have enough karma points to donate this amount",
        variant: "destructive"
      });
      return;
    }
    
    const success = donateKarmaPoints(amount);
    if (success) {
      toast({
        title: "Donation Successful",
        description: `You have donated ${amount} karma points to the community`
      });
      setDonationAmount("");
      setIsDonating(false);
    } else {
      toast({
        title: "Donation Failed",
        description: "Unable to process your donation",
        variant: "destructive"
      });
    }
  };

  const handleConvert = () => {
    const amount = parseInt(conversionAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid karma amount to convert",
        variant: "destructive"
      });
      return;
    }
    
    if (amount > psychologicalProfile.karmaBalance.total) {
      toast({
        title: "Insufficient Karma",
        description: "You don't have enough karma points to convert this amount",
        variant: "destructive"
      });
      return;
    }
    
    // Use default conversion rate of 5 SP per karma point
    const conversionRate = 5;
    const result = convertKarmaToSpiritualPoints(amount, conversionRate);
    
    if (result.success) {
      // Add the spiritual points to user progression
      addSpiritualPoints(result.spiritualPoints);
      
      toast({
        title: "Conversion Successful",
        description: `You have converted ${amount} karma points to ${result.spiritualPoints} spiritual points`
      });
      setConversionAmount("");
      setIsConverting(false);
    } else {
      toast({
        title: "Conversion Failed",
        description: result.message || "Unable to process your conversion",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="backdrop-blur-sm bg-background/70 border border-purple-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5" />
          Karma Balance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 border border-purple-500/30 text-center">
            <p className="text-3xl font-bold">{psychologicalProfile.karmaBalance.total}</p>
            <p className="text-sm text-muted-foreground">Total Karma</p>
          </div>
          
          <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-center">
            <p className="text-3xl font-bold">{psychologicalProfile.karmaBalance.earnedToday}</p>
            <p className="text-sm text-muted-foreground">Earned Today</p>
          </div>
          
          <div className="p-4 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 text-center">
            <p className="text-3xl font-bold">{psychologicalProfile.karmaBalance.donated}</p>
            <p className="text-sm text-muted-foreground">Donated</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Spiritual Points
            </h3>
            <p className="text-2xl font-bold">{progression.spiritualPoints}</p>
            <p className="text-sm text-muted-foreground">Current Balance</p>
          </div>
          
          <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-fuchsia-500/10 border border-purple-500/20">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Repeat className="h-4 w-4" />
              Conversion Rate
            </h3>
            <p className="text-2xl font-bold">1 Karma = 5 SP</p>
            <p className="text-sm text-muted-foreground">Fixed Rate</p>
          </div>
        </div>
        
        <div className="p-4 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
          <h3 className="font-medium mb-2 flex items-center gap-2">
            <Shield className="h-4 w-4" />
            How Karma Works
          </h3>
          <p className="text-sm text-muted-foreground">
            Earn karma through consistent practice, helping others, and sharing teachings. 
            Spend karma on rare sādhanās, discounts, donate to charitable causes, or convert to spiritual points.
          </p>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Earn More Karma</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                onClick={() => addKarmaPoints(10)}
                className="flex items-center gap-2 border-green-500/30 hover:bg-green-500/10"
              >
                <Plus className="h-4 w-4" />
                Daily Practice (+10)
              </Button>
              <Button 
                variant="outline" 
                onClick={() => addKarmaPoints(25)}
                className="flex items-center gap-2 border-blue-500/30 hover:bg-blue-500/10"
              >
                <Users className="h-4 w-4" />
                Help Others (+25)
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Spend Karma</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="flex items-center gap-2 border-purple-500/30 hover:bg-purple-500/10"
              >
                <BookOpen className="h-4 w-4" />
                Unlock Rare Sādhanās
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2 border-amber-500/30 hover:bg-amber-500/10"
              >
                <ShoppingCart className="h-4 w-4" />
                Spiritual Book Discounts
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Convert Karma to Spiritual Points</h3>
            {isConverting ? (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="conversion" className="text-sm">
                    Karma Amount to Convert
                  </Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="conversion"
                      type="number"
                      placeholder="Enter karma amount"
                      value={conversionAmount}
                      onChange={(e) => setConversionAmount(e.target.value)}
                      className="bg-background/50 border-purple-500/20 focus:border-purple-500/50"
                    />
                    <Button 
                      onClick={handleConvert}
                      className="bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600"
                    >
                      Convert
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Conversion rate: 1 Karma = 5 Spiritual Points
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setIsConverting(false)}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button 
                onClick={() => setIsConverting(true)}
                className="w-full flex items-center gap-2 bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600"
              >
                <Repeat className="h-4 w-4" />
                Convert to Spiritual Points
              </Button>
            )}
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Donate Karma</h3>
            {isDonating ? (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="donation" className="text-sm">
                    Donation Amount
                  </Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="donation"
                      type="number"
                      placeholder="Enter amount"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      className="bg-background/50 border-purple-500/20 focus:border-purple-500/50"
                    />
                    <Button 
                      onClick={handleDonate}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                    >
                      Donate
                    </Button>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setIsDonating(false)}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button 
                onClick={() => setIsDonating(true)}
                className="w-full flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
              >
                <Gift className="h-4 w-4" />
                Donate to Community Seva
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KarmaBalance;