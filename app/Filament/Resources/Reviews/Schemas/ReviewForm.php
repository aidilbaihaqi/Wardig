<?php

namespace App\Filament\Resources\Reviews\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\RatingField;
use Filament\Schemas\Schema;

class ReviewForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Informasi Review')
                    ->schema([
                        Select::make('product_id')
                            ->label('Produk')
                            ->relationship('product', 'name')
                            ->required()
                            ->searchable(),
                        TextInput::make('customer_name')
                            ->label('Nama Pelanggan')
                            ->required()
                            ->maxLength(255),
                        RatingField::make('rating')
                            ->label('Rating')
                            ->required()
                            ->min(1)
                            ->max(5)
                            ->stars(5),
                        Select::make('status')
                            ->label('Status')
                            ->options([
                                'pending' => 'Menunggu',
                                'approved' => 'Disetujui',
                                'rejected' => 'Ditolak'
                            ])
                            ->default('pending')
                            ->required(),
                    ])
                    ->columns(2),

                Section::make('Komentar & Gambar')
                    ->schema([
                        Textarea::make('comment')
                            ->label('Komentar')
                            ->required()
                            ->rows(4)
                            ->columnSpanFull(),
                        FileUpload::make('review_images')
                            ->label('Gambar Review')
                            ->image()
                            ->multiple()
                            ->directory('review-images')
                            ->visibility('public')
                            ->imageEditor()
                            ->columnSpanFull()
                            ->helperText('Upload gambar review (opsional)'),
                    ]),
            ]);
    }
}
