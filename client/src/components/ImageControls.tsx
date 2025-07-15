
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ImageControlsProps {
  logoSize: number;
  logoOpacity: number;
  logoPosition: string;
  logoShape: string;
  onLogoSizeChange: (value: number) => void;
  onLogoOpacityChange: (value: number) => void;
  onLogoPositionChange: (value: string) => void;
  onLogoShapeChange: (value: string) => void;
}

export const ImageControls = ({
  logoSize,
  logoOpacity,
  logoPosition,
  logoShape,
  onLogoSizeChange,
  onLogoOpacityChange,
  onLogoPositionChange,
  onLogoShapeChange
}: ImageControlsProps) => {
  return (
    <div className="space-y-4 bg-slate-50 p-4 rounded-lg">
      <div>
        <Label className="block text-slate-700 mb-2">Logo Size</Label>
        <Slider
          value={[logoSize]}
          onValueChange={(value) => onLogoSizeChange(value[0])}
          max={30}
          min={10}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Small</span>
          <span>{logoSize}%</span>
          <span>Large</span>
        </div>
      </div>

      <div>
        <Label className="block text-slate-700 mb-2">Logo Opacity</Label>
        <Slider
          value={[logoOpacity]}
          onValueChange={(value) => onLogoOpacityChange(value[0])}
          max={100}
          min={0}
          step={5}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Transparent</span>
          <span>{logoOpacity}%</span>
          <span>Opaque</span>
        </div>
      </div>

      <div>
        <Label className="block text-slate-700 mb-2">Logo Position</Label>
        <Select value={logoPosition} onValueChange={onLogoPositionChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="top-left">Top Left</SelectItem>
            <SelectItem value="top-right">Top Right</SelectItem>
            <SelectItem value="bottom-left">Bottom Left</SelectItem>
            <SelectItem value="bottom-right">Bottom Right</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="block text-slate-700 mb-2">Logo Shape</Label>
        <Select value={logoShape} onValueChange={onLogoShapeChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="original">Original</SelectItem>
            <SelectItem value="circle">Circle</SelectItem>
            <SelectItem value="rounded">Rounded Square</SelectItem>
            <SelectItem value="square">Square</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
