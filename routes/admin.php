<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\DegreesAdminController;
use App\Http\Controllers\SettingsAdminController;
use App\Http\Controllers\StatisticsAdminController;
use App\Http\Controllers\StudentsAdminController;
use App\Http\Controllers\SubjectsAdminController;
use Illuminate\Support\Facades\Route;

define('PAGINATION', 20);

Route::get('/', [AdminController::class, 'index'])->name('admin.index');
Route::get('/logout', [AdminController::class, 'logout'])->name('admin.logout');


/********************************************* Statistics **********************************************/

Route::get('/statistics', [StatisticsAdminController::class, 'statistics'])->name('statistics');
Route::post('/statistics/{state}', [StatisticsAdminController::class, 'getStatistics']);

/*******************************************************************************************************/



/********************************************** Students ***********************************************/

Route::get('/students', [StudentsAdminController::class, 'students'])->name('students');
Route::post('/page/students/{state}', [StudentsAdminController::class, 'studentsPage']);
Route::post('students/create', [StudentsAdminController::class, 'addNewStudent']);
Route::post('students/edit', [StudentsAdminController::class, 'editStudent']);
Route::delete('students/delete/{id}', [StudentsAdminController::class, 'removeStudent']);

/*******************************************************************************************************/



/********************************************** subjects ***********************************************/

Route::get('/subjects', [SubjectsAdminController::class, 'subjects'])->name('subjects');
Route::get('/major/subjects/{major}', [SubjectsAdminController::class, 'majorSubjects']);
Route::post('/subjects/create', [SubjectsAdminController::class, 'addNewSubject']);
Route::post('/subjects/edit', [SubjectsAdminController::class, 'editSubject']);
Route::delete('/subjects/delete/{id}', [SubjectsAdminController::class, 'removeSubject']);

/*******************************************************************************************************/



/********************************************** degrees ************************************************/

Route::get('/degrees', [DegreesAdminController::class, 'degrees'])->name('degrees');
Route::get('student/degrees/{ssn}', [DegreesAdminController::class, 'studentDegrees']);
Route::post('page/degrees/{degreesType}/{state}', [DegreesAdminController::class, 'degreesPage']);
Route::post('/degrees/create', [DegreesAdminController::class, 'addNewDegrees']);
Route::post('/degrees/edit', [DegreesAdminController::class, 'editDegrees']);
Route::delete('/degrees/delete/{student}', [DegreesAdminController::class, 'removeDegrees']);

/*******************************************************************************************************/

/********************************************* settings ************************************************/

Route::post('/put-show-date/{date}', [SettingsAdminController::class, 'putShowDate']);

/*******************************************************************************************************/
