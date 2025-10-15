<?php

namespace App\Filament\Resources\Products\Tables;

use App\Models\Product;
use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\RoundBlockSizeMode;
use Illuminate\Support\Facades\Storage;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\Action;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class ProductsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->label('Nama Produk')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('umkmProfile.name')
                    ->label('UMKM')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('unique_code')
                    ->label('Kode Unik')
                    ->searchable()
                    ->copyable()
                    ->copyMessage('Kode unik disalin!')
                    ->copyMessageDuration(1500),
                BadgeColumn::make('status')
                    ->label('Status')
                    ->colors([
                        'success' => 'active',
                        'danger' => 'inactive',
                    ])
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'active' => 'Aktif',
                        'inactive' => 'Tidak Aktif',
                        default => $state,
                    }),
                TextColumn::make('reviews_count')
                    ->label('Jumlah Review')
                    ->counts('reviews')
                    ->sortable(),
                TextColumn::make('qr_scans_count')
                    ->label('Scan QR')
                    ->counts('qrScans')
                    ->sortable(),
                TextColumn::make('created_at')
                    ->label('Dibuat')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->label('Diperbarui')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->label('Status')
                    ->options([
                        'active' => 'Aktif',
                        'inactive' => 'Tidak Aktif',
                    ]),
                SelectFilter::make('umkm_id')
                    ->label('UMKM')
                    ->relationship('umkmProfile', 'name'),
            ])
            ->recordActions([
                ViewAction::make(),
                EditAction::make(),
                Action::make('view_qr')
                    ->label('Lihat QR')
                    ->visible(fn (Product $record) => filled($record->qr_code_path))
                    ->url(fn (Product $record) => route('product.qr', ['product' => $record->id]))
                    ->openUrlInNewTab(),
                Action::make('download_qr')
                    ->label('Download QR')
                    ->visible(fn (Product $record) => filled($record->qr_code_path))
                    ->url(fn (Product $record) => route('product.qr.download', ['product' => $record->id]))
                    ->openUrlInNewTab(),
                Action::make('regenerate_qr')
                    ->label(fn (Product $record) => $record->qr_code_path ? 'Regenerate QR' : 'Generate QR')
                    ->color('primary')
                    ->requiresConfirmation()
                    ->action(function (Product $record) {
                        // Delete old QR if exists
                        if ($record->qr_code_path) {
                            Storage::disk('public')->delete($record->qr_code_path);
                        }

                        $url = route('product.show', $record->unique_code);

                        $qrCode = new QrCode(
                            $url,
                            new Encoding('UTF-8'),
                            ErrorCorrectionLevel::High,
                            500,
                            10,
                            RoundBlockSizeMode::Margin,
                        );

                        $result = (new PngWriter())->write($qrCode);

                        $fileName = 'qr_codes/product_' . $record->id . '_' . time() . '.png';
                        Storage::disk('public')->put($fileName, $result->getString());

                        $record->update(['qr_code_path' => $fileName]);
                    }),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'asc');
    }
}
