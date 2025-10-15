<?php

namespace App\Filament\Resources\Products\Pages;

use App\Filament\Resources\Products\ProductResource;
use App\Models\Product;
use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\RoundBlockSizeMode;
use Illuminate\Support\Facades\Storage;
use Filament\Resources\Pages\CreateRecord;

class CreateProduct extends CreateRecord
{
    protected static string $resource = ProductResource::class;

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }

    protected function afterCreate(): void
    {
        /** @var Product $product */
        $product = $this->record;

        if (! $product->qr_code_path) {
            $url = route('product.show', $product->unique_code);

            $qrCode = new QrCode(
                $url,
                new Encoding('UTF-8'),
                ErrorCorrectionLevel::High,
                500,
                10,
                RoundBlockSizeMode::Margin,
            );

            $result = (new PngWriter())->write($qrCode);

            $fileName = 'qr_codes/product_' . $product->id . '_' . time() . '.png';
            Storage::disk('public')->put($fileName, $result->getString());

            $product->update(['qr_code_path' => $fileName]);
        }
    }
}
