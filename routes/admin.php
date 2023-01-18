<?php

use App\Http\Controllers\AdminController;
use Illuminate\Support\Facades\Route;

define('PAGINATION', 20);

Route::get('/', [AdminController::class, 'index'])->name('admin.index');
Route::get('/logout', [AdminController::class, 'logout'])->name('admin.logout');


/********************************************* Statistics **********************************************/

Route::get('/statistics', [AdminController::class, 'statistics'])->name('statistics');
Route::post('/statistics/{state}', [AdminController::class, 'getStatistics']);

/*******************************************************************************************************/



/********************************************** Students ***********************************************/

Route::get('/students', [AdminController::class, 'students'])->name('students');
Route::post('/page/students/{state}', [AdminController::class, 'studentsPage']);
Route::post('students/create', [AdminController::class, 'addNewStudent']);
Route::post('students/edit', [AdminController::class, 'editStudent']);
Route::delete('students/delete/{id}', [AdminController::class, 'removeStudent']);

/*******************************************************************************************************/



/********************************************** subjects ***********************************************/

Route::get('/subjects', [AdminController::class, 'subjects'])->name('subjects');
Route::get('/major/subjects/{major}', [AdminController::class, 'majorSubjects']);
Route::post('/subjects/create', [AdminController::class, 'addNewSubject']);
Route::post('/subjects/edit', [AdminController::class, 'editSubject']);
Route::delete('/subjects/delete/{id}', [AdminController::class, 'removeSubject']);

/*******************************************************************************************************/



/********************************************** degrees ************************************************/

Route::get('/degrees', [AdminController::class, 'degrees'])->name('degrees');
Route::get('student/degrees/{ssn}', [AdminController::class, 'studentDegrees']);
Route::post('page/degrees/{degreesType}/{state}', [AdminController::class, 'degreesPage']);
Route::post('/degrees/create', [AdminController::class, 'addNewDegrees']);
Route::post('/degrees/edit', [AdminController::class, 'editDegrees']);
Route::delete('/degrees/delete/{student}', [AdminController::class, 'removeDegrees']);

/*******************************************************************************************************/

/********************************************* settings ************************************************/

Route::post('/put-show-date/{date}', [AdminController::class, 'putShowDate']);

/*******************************************************************************************************/
