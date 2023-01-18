<?php

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Route;

// The order for States array is very important

define('STATES', collect(['الخرطوم', 'الجزيرة', 'القضارف', 'كسلا', 'سنار', 'البحر الأحمر', 'نهر النيل', 'النيل الأزرق', 'النيل الأبيض', 'الشمالية', 'شمال دارفور', 'جنوب دارفور', 'وسط دارفور', 'غرب دارفور', 'شرق دارفور', 'شمال كردفان', 'جنوب كردفان', 'غرب كردفان']));

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [Controller::class, 'main']) -> name('main');

Route::get('/admin-login', [Controller::class, 'adminLoginForm']) -> name('admin.login');

Route::get('/student-login', [Controller::class, 'studentLoginForm']) -> name('student.login');

Route::post('/check-admin', [Controller::class, 'isAdmin']) -> name('check.admin');

Route::post('/check-student', [Controller::class, 'isStudent']) -> name('check.student');

Route::get('/get-show-date', [Controller::class, 'getShowDate']);
