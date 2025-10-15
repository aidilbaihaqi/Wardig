<?php

namespace App\Filament\Resources\UmkmProfiles\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\FileUpload;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class UmkmProfileForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Informasi UMKM')
                    ->schema([
                        TextInput::make('name')
                            ->label('Nama UMKM')
                            ->required()
                            ->maxLength(255),
                        TextInput::make('owner_name')
                            ->label('Nama Pemilik')
                            ->required()
                            ->maxLength(255),
                        Textarea::make('address')
                            ->label('Alamat')
                            ->required()
                            ->rows(3)
                            ->columnSpanFull(),
                        TextInput::make('phone')
                            ->label('Nomor Telepon')
                            ->tel()
                            ->required()
                            ->maxLength(20),
                        TextInput::make('email')
                            ->label('Email')
                            ->email()
                            ->maxLength(255),
                        TextInput::make('established_year')
                            ->label('Tahun Berdiri')
                            ->numeric()
                            ->minValue(1900)
                            ->maxValue(date('Y')),
                    ])
                    ->columns(2),
                
                Section::make('Cerita & Logo')
                    ->schema([
                        Textarea::make('story')
                            ->label('Cerita UMKM')
                            ->required()
                            ->rows(4)
                            ->columnSpanFull(),
                        FileUpload::make('logo_path')
                            ->label('Logo UMKM')
                            ->image()
                            ->directory('umkm-logos')
                            ->visibility('public')
                            ->imageEditor()
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}
