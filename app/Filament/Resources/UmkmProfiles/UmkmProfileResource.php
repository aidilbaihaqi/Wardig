<?php

namespace App\Filament\Resources\UmkmProfiles;

use App\Filament\Resources\UmkmProfiles\Pages\CreateUmkmProfile;
use App\Filament\Resources\UmkmProfiles\Pages\EditUmkmProfile;
use App\Filament\Resources\UmkmProfiles\Pages\ListUmkmProfiles;
use App\Filament\Resources\UmkmProfiles\Schemas\UmkmProfileForm;
use App\Filament\Resources\UmkmProfiles\Tables\UmkmProfilesTable;
use App\Models\UmkmProfile;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;
use UnitEnum;

class UmkmProfileResource extends Resource
{
    protected static ?string $model = UmkmProfile::class;

    protected static string | BackedEnum | null $navigationIcon = 'heroicon-o-building-storefront';

    protected static ?string $navigationLabel = 'UMKM';

    protected static string | UnitEnum | null $navigationGroup = 'Manajemen UMKM';

    protected static ?int $navigationSort = 1;

    protected static ?string $modelLabel = 'UMKM';

    protected static ?string $pluralModelLabel = 'UMKM';

    protected static ?string $recordTitleAttribute = 'name';

    public static function form(Schema $schema): Schema
    {
        return UmkmProfileForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return UmkmProfilesTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListUmkmProfiles::route('/'),
            'create' => CreateUmkmProfile::route('/create'),
            'edit' => EditUmkmProfile::route('/{record}/edit'),
        ];
    }
}
