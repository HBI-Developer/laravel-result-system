<?php

use App\Http\Controllers\CertificateStudentController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudentController;

Route::get('/', [StudentController::class, 'index'])->name('student.index');
Route::get('/logout', [StudentController::class, 'logout'])->name('student.logout');

/******************************************** Certificate **********************************************/

Route::get('/certificate', [CertificateStudentController::class, 'certificate'])->name('student.certificate');

/*******************************************************************************************************/