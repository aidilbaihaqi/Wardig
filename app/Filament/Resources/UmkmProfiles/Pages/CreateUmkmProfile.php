<?php

namespace App\Filament\Resources\UmkmProfiles\Pages;

use App\Filament\Resources\UmkmProfiles\UmkmProfileResource;
use Filament\Resources\Pages\CreateRecord;

class CreateUmkmProfile extends CreateRecord
{
    protected static string $resource = UmkmProfileResource::class;

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
