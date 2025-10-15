<?php

namespace App\Filament\Resources\Products\Schemas;

use App\Models\UmkmProfile;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\FileUpload;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class ProductForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Informasi Produk')
                    ->schema([
                        Select::make('umkm_id')
                            ->label('UMKM')
                            ->options(UmkmProfile::all()->pluck('name', 'id'))
                            ->required()
                            ->searchable(),
                        TextInput::make('name')
                            ->label('Nama Produk')
                            ->required()
                            ->maxLength(255)
                            ->live(onBlur: true)
                            ->afterStateUpdated(function (string $operation, $state, $set) {
                                if ($operation !== 'create') {
                                    return;
                                }
                                $set('unique_code', Str::random(10));
                            }),
                        Select::make('status')
                            ->label('Status')
                            ->options([
                                'active' => 'Aktif',
                                'inactive' => 'Tidak Aktif'
                            ])
                            ->default('active')
                            ->required(),
                        TextInput::make('unique_code')
                            ->label('Kode Unik')
                            ->required()
                            ->maxLength(255)
                            ->unique(ignoreRecord: true)
                            ->helperText('Kode unik akan dibuat otomatis'),
                    ])
                    ->columns(2),

                Section::make('Deskripsi Produk')
                    ->schema([
                        Textarea::make('description')
                            ->label('Deskripsi')
                            ->required()
                            ->rows(4)
                            ->columnSpanFull(),
                        Textarea::make('history')
                            ->label('Sejarah Produk')
                            ->required()
                            ->rows(4),
                        Textarea::make('philosophy')
                            ->label('Filosofi Produk')
                            ->required()
                            ->rows(4),
                    ])
                    ->columns(2),

                Section::make('Media')
                    ->schema([
                        FileUpload::make('video_path')
                            ->label('Video Produk')
                            ->acceptedFileTypes(['video/mp4', 'video/avi', 'video/mov'])
                            ->directory('product-videos')
                            ->visibility('public')
                            ->columnSpanFull(),
                        TextInput::make('qr_code_path')
                            ->label('QR Code Path')
                            ->disabled()
                            ->helperText('QR Code akan dibuat otomatis')
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}
