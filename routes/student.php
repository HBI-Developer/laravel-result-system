<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudentController;

Route::get('/', [StudentController::class, 'index'])->name('student.index');
Route::get('/logout', [StudentController::class, 'logout'])->name('student.logout');
Route::get('/certificate', [StudentController::class, 'certificate'])->name('student.certificate');
