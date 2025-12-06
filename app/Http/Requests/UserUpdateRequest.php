<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserUpdateRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $userId = $this->route('user')->id;

        return [
            'name' => 'required|min:3|max:255',
            'email' => 'required|email|unique:users,email,' . $userId,
            'phone' => 'required|string|max:20',
            'password' => 'nullable|confirmed|min:4',
            'selectedRoles' => 'required|array|min:1',
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'Nama lengkap wajib diisi.',
            'name.min' => 'Nama minimal 3 karakter.',
            'email.required' => 'Alamat email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Alamat email sudah digunakan.',
            'phone.required' => 'Nomor handphone wajib diisi.',
            'phone.string' => 'Nomor handphone harus berupa teks.',
            'phone.max' => 'Nomor handphone maksimal 20 karakter.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
            'password.min' => 'Password minimal 4 karakter.',
            'selectedRoles.required' => 'Pilih minimal 1 role.',
            'selectedRoles.array' => 'Format roles tidak valid.',
            'selectedRoles.min' => 'Pilih minimal 1 role.',
        ];
    }
}
