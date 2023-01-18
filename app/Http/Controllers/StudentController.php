<?php

namespace App\Http\Controllers;

use App\Models\Degree;
use App\Models\Setting;
use App\Models\Student;
use App\Models\Subject;
use DateTime;
use Illuminate\Support\Facades\Auth;

class StudentController extends Controller
{
    public function __construct()
    {

        /*
            Should be user logining as student for access to this pages
            by using student guard.
        */

        $this->middleware('auth:student');
    }

    /********************************************* Student Page ********************************************/

    public function index() {

        $data = $this -> getData();

        return view('student.index', $data);
    }

    public function logout() {
        Auth::guard('student')->logout();
        return redirect('/');
    }

    /*******************************************************************************************************/

    /********************************************* Certificate *********************************************/

    public function certificate() {

        /*
            @variable $student_info contains student logining info

            @variable $student contains degrees are belongs to student with subject name for each degree
            
            @variable $state subjects and with each subject degrees for it, and that degrees must be belongs
                to students from state which is state of logining student

            @variable $all get subjects with avarage of degrees for each subjects for all country
        */

        $student_info = Auth::guard('student')->user();

        $student = Degree::whereBelongsTo($student_info)->with('subject')->get();

        $state = Subject::with(['degrees' => function($query) {
            
            $students = Student::where('state', STATES->search(Auth::guard('student')->user()->state) + 1)->get();

            $query->whereBelongsTo($students);

        }])->select('id', 'subject_name')->get();

        $all = Subject::withAvg('degrees as degree', 'degree')->get();

        $statistics = collect([]);

        foreach ($student as $degree) {

            // Set global variable for subject name

            $GLOBALS['subject'] = $degree->subject->subject_name;

            // put all degree for certain subject [in $degree] in state in $state_degree

            $state_degree = $state->filter(function ($item, $key) {
                return $item->subject_name === $GLOBALS['subject'];
            });

            // put all degree for certain subject [in $degree] in all country in $all_degree

            $all_degree = $all->filter(function ($item, $key) {
                return $item->subject_name === $GLOBALS['subject'];
            });

            /*
                Put [subject name, student degree, medium degree in state, medium degree in country]
                in $statistics
            */

            $statistics->push([
                'subject' => $GLOBALS['subject'],
                'student' => $degree->degree,
                'state' => round($state_degree->first()->degrees->avg('degree'), 2),
                'all' => round($all_degree->first()->degree, 2)
            ]);
        }
        
        return view('student.certificate', compact('student', 'statistics'));
    }

    /*******************************************************************************************************/

    /******************************************* Other Functions *******************************************/


    // Function for return value [not for insert, update, delete or return view]

    
    // Student Page Functions ******************************************************************

    public function getData() {

        /*
            @variable $time contains date of open system for students

            @variable $strtime the date store in DB by milliseconds, here convert to second by trim
                3 number on right
        */

        $time = Setting::where('name', 'show degrees date')->select('value')->get()->first()->value;
        $strtime = substr($time, 0, mb_strlen($time) - 3);
        $data = [];
        
        if (intval($strtime) - time() > 0) {

            /*
                By convert $strtime to number, If $strtime sub current time greater than 0, that means
                date of open is not coming
            */

            // @variable $date is converted $strtime to date
            // @variable $now is current time in date

            $date = new DateTime('@'. $strtime);
            $now = new DateTime();

            // $diff is diffrent between $date and $now in [days, hours, minutes, seconds] and return as string

            $diff = $now->diff($date)->format('%a-%h-%i-%s');

            // explode string to array and separator char is [-] in $diff

            $diff = explode('-', $diff);

            // add $time to $diff array and assigning to $data

            array_push($diff, $time);
            $data = compact('diff');
        } else {

            // If current time after open time

            // @variable $student contains logining student info
            // @vaiiable $degrees contains degrees for this student with subject name for each degree

            $student = Auth::guard('student')->user();
            $degrees = Degree::whereBelongsTo($student)->with(['subject' => function ($q) {
                $q->select(['id', 'subject_name']);
            }])->get();

            if ($degrees->count() > 0) {

                // If that student have degrees

                // Make [id, student id, subject id] hidden

                $degrees->makeHidden(['id', 'student_id', 'subject_id']);

                // for each subject make [id] hidden

                $degrees->each(function ($item, $key) {
                    $item->subject->makeHidden(['id']);
                });

                // get avarage for all degrees of student
    
                $total = $degrees->avg('degree');
    
                $data = compact('degrees', 'total');
            }
        }

        return $data;
    }

    // *****************************************************************************************

    /*******************************************************************************************************/
}
