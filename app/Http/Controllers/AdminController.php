<?php

namespace App\Http\Controllers;

use App\Http\Requests\DegreeRequest;
use App\Http\Requests\StudentRequest;
use App\Http\Requests\SubjectRequest;
use App\Models\Degree;
use App\Models\Setting;
use App\Models\Student;
use App\Models\Subject;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{

    public function __construct()
    {
        /*
            Should be user logining as admin for access to this pages
            by using admin guard.
        */

        $this->middleware('auth:admin');
    }

    public function index()
    {
        return view('admin.index');
    }

    public function logout() {
        Auth::guard('admin')->logout();
        return redirect('/');
    }

    /********************************************* Statistics **********************************************/

    public function statistics()
    {
        // Get all statistics from getStatistics Function

        $statistics = $this -> getStatistics();

        // Get view with send statistics

        return view("admin.statistics", $statistics);
    }

    /*******************************************************************************************************/


    /********************************************** Students ***********************************************/

    public function students()
    {
        // Get students and number of items in PAGINATION

        // PAGINATION Constant in routes/admin.php

        $students = Student::paginate(PAGINATION);

        return view('admin.students', compact('students'));
    }


    public function studentsPage($state = 0)
    {
        // $state get from view
        if ($state == 0) {

            // If don't have value get all students

            $students = Student::paginate(PAGINATION);
        } else {

            // If have value get students from this state

            $students = Student::where('state', $state)->paginate(PAGINATION);
        }

        return $students;
    }

    public function addNewStudent(StudentRequest $request)
    {

        // To accept $request vaild all rules in StudentRequest

        // After Vaild, Vaildator ssn & sitting numbers (Add rules in getRules function)

        $rules = $this -> getRules();
        $messages = $this -> getMessages();
        $validator = Validator::make($request->all(), $rules, $messages);

        // If fails in vaildator return error with errors array

        if ($validator->fails())
            return $validator->errors();

        // If all values is vaild Add new student to DB

        Student::create([
            'ssn'               => intval($request->ssn),
            'first_name'        => $request->first_name,
            'middle_name'       => $request->middle_name,
            'last_name'         => $request->last_name,
            'age'               => $request->age,
            'gender'            => $request->gender,
            'school'            => $request->school,
            'state'             => $request->state,
            'sitting_number'    => $request->sitting_number,
            'specialization'    => $request->major
        ]);

        return 'success';
    }

    public function editStudent(StudentRequest $request) {

        // To accept $request vaild all rules in StudentRequest

        // Check if Student is exist

        $student = Student::where('ssn', intval($request->ssn))->get();

        // If not exist return error 
        
        if (!$student)
            return 'unexists';

        // If exist put ssn and major in variables
        
        $ssn = $student[0]->ssn;
        $major = $student[0]->major;

        /*
            After Vaildate $request and check if student exist, Vaildator ssn & sitting
            numbers (Edit rules in getRules function)
        */
        
        $rules = $this -> getRules(2, $ssn, $student[0]->sitting_number);
        $messages = $this -> getMessages();
        $validator = Validator::make($request->all(), $rules, $messages);

        // If fails in vaildator return error with errors array

        if ($validator->fails())
            return $validator->errors();

        // If all values is vaild and student exist Edit student info except ssn
        
        $student[0]->update([
            'first_name'        => $request->first_name,
            'middle_name'       => $request->middle_name,
            'last_name'         => $request->last_name,
            'age'               => $request->age,
            'gender'            => $request->gender,
            'school'            => $request->school,
            'state'             => $request->state,
            'sitting_number'    => $request->sitting_number,
            'specialization'    => $request->major
        ]);

        // If edit student major then...

        if ($request->major !== $major) {

            // @variable $subject that subjects is not shared between all students
            // @variable $subject2 that subjects for new student major
            // @variable $old_degrees the degrees of old student subjects (for delete)

            $subjects = Subject::whereNot('specialization', 0)->get();
            $subjects2 = Subject::where('specialization', $request->major)->get();
            $old_degrees = Degree::whereBelongsTo($subjects)->where('student_id', $ssn);
            $new_degrees = [];
            // $insert = false;

            // add new major subjects in $new_degrees variable with 0 degree for each subject

            foreach ($subjects2 as $subject) {
                $degree = [
                    'subject_id'    => $subject->id,
                    'degree'        => 0,
                    'student_id'    => $ssn,
                ];

                array_push($new_degrees, $degree);
            }

            // Delete old major subjects degrees and add new major subjects degrees

            $old_degrees->delete();
            
            Degree::insert($new_degrees);
            
            // if ($old_degrees->count() > 0) {
            //     $insert = true;
            // }
                
            // $old_degrees->delete();
                
            // if ($insert) {
            //     Degree::insert($new_degrees);
            // }

        }

        return 'success';
    }

    public function removeStudent($request) {

        // Get student by SSN

        $student = Student::where('ssn', $request);

        // If student isn't exist return error

        if (!$student)
            return 'unexists';

        // If exist remove student

        $student->delete();
        return 'success';
    }

    /*******************************************************************************************************/


    /********************************************** subjects ***********************************************/

    public function subjects()
    {

        // Get subjects info and get view 

        $subjects = Subject::get();
        return view('admin.subjects', compact('subjects'));
    }

    public function addNewSubject(SubjectRequest $request)
    {

        // After check if informaion in request is valid Add new subject

        Subject::create([
            'subject_name'      => $request->subject_name,
            'specialization'    => $request->major,
        ]);

        if ($request->major == 0) {

            // IF new subject shared between all majors get all students there's has degrees

            $students = Student::whereHas('degrees')->select('ssn')->get();
        } else {

            // If new subjects to certain majors get all students in this majors and there's has degrees

            $students = Student::whereHas('degrees')->where('specialization', $request->major)->select('ssn')->get();
        }

        // Get new subject from DB

        $subject = Subject::where('subject_name', $request->subject_name)->where('specialization', $request->major)->first();

        $degrees = [];

        // put degrees for new subject as 0 for the students we brought from DB

        foreach ($students as $student) {
            $data = [
                'student_id'    => $student->ssn,
                'subject_id'    => $subject->id,
                'degree'        => 0
            ];

            array_push($degrees, $data);
        }

        // insert that degrees in DB

        Degree::insert($degrees);

        return 'success';
    }

    public function editSubject(SubjectRequest $request)
    {

        // If request info is valid Get subject

        $subject = Subject::find($request->id);

        // If subject not exist return error

        if (!$subject)
            return 'unexists';

        if ($subject->specialization === 'علمي') {
            $major = 1;
        } else if ($subject->specialization === 'أدبي') {
            $major = 2;
        } else {
            $major = 0;
        }

        $GLOBALS['subject'] = $subject->id;

        // If subject exist edit subject info

        $subject->update([
            "subject_name"      => $request->subject_name,
            "specialization"    => $request->major
        ]);
        
        if ($major !== $request->major) {
            // If updating subject major

            // @variable $first_students contains students their degrees are removed
            // @variable $second_students contains students their adding to him degrees to this subject as 0

            if ($major == 0) {

                // If subject was sharing between all students

                // $first_students all students except new major students

                // $second_students contains nothing

                $first_students = Student::whereHas('degrees')->whereNot('specialization', $request->major)->get();
                $second_students = collect([]);
            } else if ($request->major == 0) {

                // If subject was for certain major and became sharing between all students add degrees to

                // $first_students contains nothing

                // $second_students students their don't have degree for this subject

                $first_students = collect([]);
                $second_students = Student::whereHas('degrees')->whereNot('specialization', $major)->whereDoesntHave('degrees', function($q) {
                    $q->where('subject_id', $GLOBALS['subject']);
                })->get();
            } else {

                // If change major subject to another major

                // $first_students contains students from old major

                // $second_students contains students from new major

                $first_students = Student::whereHas('degrees')->where('specialization', $major)->get();
                $second_students = Student::whereHas('degrees')->where('specialization', $request->major)->whereDoesntHave('degrees', function($q) {
                    $q->where('subject_id', $GLOBALS['subject']);
                })->get();
            }
            
            if ($first_students->count() > 0) {

                // If $first_students contains students get the degrees of these students and delete it

                $old_degrees = Degree::whereBelongsTo($first_students)->where('subject_id', $GLOBALS['subject']);

                $old_degrees->delete();
            }

            if ($second_students->count() > 0) {
                $new_degrees = [];

                foreach ($second_students as $student) {

                    // put new degrees for $second_students in $new_degrees

                    $degree = [
                        'student_id'    => $student->ssn,
                        'subject_id'    => $subject->id,
                        'degree'        => 0
                    ];
        
                    array_push($new_degrees, $degree);
                }

                // Insert the degrees to DB
                
                Degree::insert($new_degrees);
            }
        }

        return 'success';
    }

    public function removeSubject($request)
    {

        // Get subject

        $subject = Subject::find($request);

        // If subject is not exist return error

        if (!$subject)
            return 'unexists';

        // Get removing subject degrees

        $old_degrees = Degree::where('subject_id', $request);

        // If subject exist remove the subject with its degrees

        $subject->delete();
        $old_degrees->delete();

        return 'success';
    }

    /*******************************************************************************************************/


    /********************************************** degrees ************************************************/

    public function degrees()
    {

        /* 
            Get the [ssn, first name, middle name, last name] for students their have degrees with degrees
            and this degrees get [student id, subject id, degrees] for it with subject with [id, subject name]
            for subject, and the numbers of students is number is PAGINATION.
        */
        
        $degrees = Student::whereHas('degrees')->with(['degrees' => function ($q) {
            $q->select('degree', 'student_id', 'subject_id')->with(['subject' => function ($q) {
                $q->select('subject_name', 'id');
            }]);
        }])->select('ssn', 'first_name', 'middle_name', 'last_name')->paginate(PAGINATION);

        /*
            Get [first name, middle name, last name] for students their have degrees with avarage of this degrees
            and number of their students is PAGINATION.
        */

        $final = Student::whereHas('degrees')->select('first_name', 'middle_name', 'last_name')->withAvg('degrees as degree', 'degree')->paginate(PAGINATION);

        // Get the students without degrees to put it in input for add new student degrees

        $students_without_degrees = Student::whereDoesntHave('degrees')->select('ssn', 'first_name', 'middle_name', 'last_name', 'specialization')->get();

        /*
            Get the major for first students and convert to numbers [When get it from DB auto convert to number
            and that from accessor in Student model].
        */

        $major = $students_without_degrees[0]->specialization === 'أدبي' ? 2 : 1;

        // Get sharing and student major subjects to put it in add new students screen

        $subjects = Subject::where('specialization', '0')->orWhere('specialization', $major)->get();

        /*
            return view with degrees and total degrees and students without degrees and subjects for first student
            without degrees.
        */

        return view('admin.degrees', compact('degrees', 'final', 'students_without_degrees', 'subjects'));
    }

    public function addNewDegrees(DegreeRequest $request)
    {
        $degrees = [];


        /*
            After vaildate $request parse degrees in request as json and that because degrees is array
            and vaildate by custom rule.
        */

        $request_degrees = collect(json_decode($request->degrees));

        foreach ($request_degrees as $key => $degree) {

            // add degrees to array & add array to $degrees array

            $data = [
                "student_id"    => $request->student,
                "subject_id"    => $key,
                "degree"        => $degree
            ];

            array_push($degrees, $data);
        }

        // Insert this degrees to DB

        Degree::insert($degrees);

        return 'success';
    }

    public function editDegrees(DegreeRequest $request)
    {

        /*
            After vaildate $request parse degrees in request as json and that because degrees is array
            and vaildate by custom rule.
        */

        // @variable $stored_degrees contains degrees of student who will update his degrees
        // @variable $subjects_ids containes ids for subjects in $request_degrees

        $request_degrees = collect(json_decode($request->degrees));
        $stored_degrees = Degree::where('student_id', $request->student)->get();
        $subjects_ids = $request_degrees->keys();
        $new_degrees = collect([]);
        $old_degrees = collect([]);

        foreach ($subjects_ids as $id) {
            foreach ($stored_degrees as $degree) {

                // Put new degrees in $new_degrees and old degrees in $old_degrees

                if ($degree->subject_id === $id) {

                    // If subject_id for $degrees variable equals $id degrees

                    if ($degree->degree != $request_degrees->get($id)) {

                        /*
                            If degree in $degree variable [old degree] not equals degree in request [new degree] for
                            same subject add new degree to $new_degrees and old degree to $old_degrees.
                        */

                        $newDegree = [
                            'id'            => $degree->id,
                            'subject_id'    => $id,
                            'student_id'    => $request->student,
                            'degree'        => $request_degrees->get($id)
                        ];
                        $new_degrees->push($newDegree);
                        $old_degrees->push($degree->id);
                    }

                    break;
                }
            }
        }

        if ($old_degrees->count() > 0) {

            // if $old_degrees isn't empty delete old degrees and insert new degrees

            Degree::whereIn('id', $old_degrees)->delete();
            Degree::insert($new_degrees);
        }

        /*
            use this way in edit because it allow to update multiple rows by 2 connection with DB first to delete
            and sedond to insert.
        */

        return 'success';
    }

    public function removeDegrees($request)
    {

        // Get degrees to certain students

        $degrees = Degree::where('student_id', $request);

        // If that's degrees isn't exist return error

        if (!$degrees)
            return 'unexists';

        // If exist delete it

        $degrees->delete();
        return 'success';
    }

    /*******************************************************************************************************/

    /********************************************** settings ***********************************************/

    public function putShowDate($request) {

        // Update the date when students will be allowed to see their degrees

        if (is_numeric(intval($request)) && $request > 0) {

            /*
                If date in $request is number and don't greater than 0 update date if exist in DB
                if not exist insert it in DB.
            */ 

            Setting::updateOrCreate(
                ['name'     => 'show degrees date'],
                ['value'    => $request]
            );
        }

        return 'success';
    }

    /*******************************************************************************************************/



    /******************************************* Other Functions *******************************************/


    // Function for return value [not for insert, update, delete or return view]
    

    // Statistics Functions **********************************************************************

    public function getStatistics($state = 0) {

        // put $state value in global variables

        $GLOBALS['state'] = $state;

        // Get [id, subject name] with avarage degrees for males

        $males = Subject::with(['degrees' => function($query) {
            $students = collect();

            if ($GLOBALS['state'] > 0) {

                /*
                    If there's state to get subjects degrees from it, put males students from
                    that state in $students variable
                */

                $students = Student::where('gender', 1)->where('state', $GLOBALS['state'])->get();
            } else {

                // If not put all males in $students variable

                $students = Student::where('gender', 1)->get();
            }

            // get degrees belongs to students in $students variable

            $query->whereBelongsTo($students);
        }])->select('id', 'subject_name')->withAvg('degrees as degree', 'degree')->get();

        // Get [id, subject name] with avarage degrees for females

        $females = Subject::with(['degrees' => function($query) {

            if ($GLOBALS['state'] > 0) {
                
                /*
                    If there's state to get subjects degrees from it, put females students from
                    that state in $students variable
                */

                $students = Student::where('gender', 2)->where('state', $GLOBALS['state'])->get();
            } else {

                // If not put all females in $students variable

                $students = Student::where('gender', 2)->get();
            }

            // get degrees belongs to students in $students variable

            $query->whereBelongsTo($students);
        }])->select('id', 'subject_name')->withAvg('degrees as degree', 'degree')->get();
        

        $details_statistics = collect([]);


        for ($i = 0; $i < $males->count(); $i++) {

            // put details degrees for males and females and both to each subject
            // @variable $male contains avarage degrees of males in certain subject
            // @variable $female contains avarage degrees of females in certain subject
            // @variable $all is medium between $male and $female

            $male = round($males[$i]->degrees->avg('degree'), 2);
            $female = round($females[$i]->degrees->avg('degree'), 2);
            $all = round(($male + $female) / 2, 2);

            // Add all that variables with subject name as array to $details_statistics collection

            $details_statistics->push([
                "subject"   => $males[$i]->subject_name,
                "males"     => $male,
                "females"   => $female,
                "all"       =>$all
            ]);
        }

        // @variable $total_males is avarage degrees of males in all subjects
        // @variable $total_females is avarage degrees of females in all subjects
        // @variable $total is avarage degrees of all students in all subjects

        $total_males = round($details_statistics->avg('males'), 2);
        $total_females = round($details_statistics->avg('females'), 2);
        $total = round(($total_males + $total_females) / 2, 2);

        // create $total_statistics collection and add variables to it

        $total_statistics = collect([
            "males"     => $total_males,
            "females"   => $total_females,
            "all"       => $total
        ]);

        // return $details_statistics and $total_statistics collections

        return compact('details_statistics', 'total_statistics');
    }

    // *****************************************************************************************


    // Students Functions **********************************************************************

    /* 
        @param $type: Is that [new = 1] or [edit = 2]
        @param $ssn: In case edit has except value for SSN
        @param $sitting_number: In case edit has except value for Sitting Number

        @return Rules that use to vaildate SSN and sitting number
    */

    public function getRules($type = 1, $ssn = null, $sitting_number = null) {

        $rules = [];
        switch ($type) {
            case 1: {
                $rules = [
                    "ssn"               => 'required|integer|unique:students,ssn|min:1000000000|max:9999999999',
                    "sitting_number"    => 'required|integer|unique:students,sitting_number|min:100000|max:999999'
                ];
            break;}

            case 2: {
                $rules = [
                    "ssn" => [
                        'required',
                        'integer',
                        'min:1000000000',
                        'max:9999999999',
                        Rule::unique('students', 'ssn')->ignore($ssn, 'ssn')
                    ],
                    "sitting_number" => [
                        'required',
                        'integer',
                        'max:999999',
                        'min:100000',
                        Rule::unique('students', 'sitting_number')->ignore($sitting_number, 'sitting_number')
                    ]
                ];
            break;}

            default: {
                return;
            }
        }

        return $rules;

    }

    /*
        @return messages for rules of validator in getRules function
    */

    public function getMessages() {
        $messages = [
            "ssn.required"              => 'لا يمكنك ترك هذا الحقل فارغاً.',
            "ssn.integer"               => 'يجب أن يحتوي هذا الحقل على أرقام فقط.',
            "ssn.unique"                => 'هذا الرقم الوطني مسجّل مسبقاً.',
            "ssn.min"                   => 'يجب أن يتكوّن الرقم الوطني من 10 أرقام.',
            "ssn.max"                   => 'يجب أن يتكوّن الرقم الوطني من 10 أرقام.',
            "sitting_number.required"   => 'لا يمكنك ترك هذا الحقل فارغاً.',
            "sitting_number.integer"    => 'يجب أن يحتوي هذا الحقل على أرقام فقط.',
            "sitting_number.unique"     => 'رقم الجلوس هذا مسجّل مسبقاً.',
            "sitting_number.min"        => 'يجب أن يتكوّن رقم الجلوس من 6 أرقام.',
            "sitting_number.max"        => 'يجب أن يتكوّن رقم الجلوس من 6 أرقام.'
        ];

        return $messages;
    }

    // *****************************************************************************************


    // Subjects Functions **********************************************************************

    /*
        @return Subjects for major in $major param with sharing subjects, and in case $major
        equals 0 return all subjects
    */

    public function majorSubjects($major = 0)
    {
        if ($major != 0) {
            $subjects = Subject::where('specialization', '0')->orWhere('specialization', $major)->get();
        } else {
            $subjects = Subject::get();
        }

        return $subjects;
    }

    // *****************************************************************************************

    // degrees Functions ***********************************************************************

    /*
        @return degrees for certain student that has $ssn with subject name for each degree
    */

    public function studentDegrees($ssn)
    {
        $student = Student::whereHas('degrees')->with(['degrees' => function ($q) {

            $q->select('degree', 'student_id', 'subject_id')->with(['subject' => function ($q) {

                $q->select('subject_name', 'id');

            }]);

        }])->where("ssn", $ssn)->select('ssn', 'first_name', 'middle_name', 'last_name')->get();

        return $student;
    }

    /*
        @param $degrees_type is that degrees is [details] degrees or [total] degrees
        @param $state is that degrees for certain state [state = number] or all country [state = 0]

        @return degrees with params conditions
    */

    public function degreesPage($degrees_type, $state = 0)
    {
        if ($degrees_type === "details") {

            // If $degrees_type is details

            if ($state == 0) {

                /*
                    If $state is 0 get [ssn, first name, middle name, last name] students they have
                    degrees with their degrees and with subject name for each degree and number of
                    students is PAGINATION
                */

                $degrees = Student::whereHas('degrees')->with(['degrees' => function ($q) {

                    $q->select('degree', 'student_id', 'subject_id')->with(['subject' => function ($q) {

                        $q->select('subject_name', 'id');

                    }]);

                }])->select('ssn', 'first_name', 'middle_name', 'last_name')->paginate(PAGINATION);


            } else {

                /*
                    If $state is certain state get [ssn, first name, middle name, last name] students
                    they have degrees and from this state with their degrees and with subject name for
                    each degree and number of students is PAGINATION
                */

                $degrees = Student::where('state', $state)->whereHas('degrees')->with(['degrees' => function ($q) {

                    $q->select('degree', 'student_id', 'subject_id')->with(['subject' => function ($q) {

                        $q->select('subject_name', 'id');

                    }]);

                }])->select('ssn', 'first_name', 'middle_name', 'last_name')->paginate(PAGINATION);

            }
        } else {

            // If $degrees_type is total

            if ($state == 0) {

                /*
                    If $state is 0 get [first name, middle name, last name] students they have degrees with
                    avarage of degrees for that students, and number of students is PAGINATION
                */

                $degrees = Student::whereHas('degrees')->select('first_name', 'middle_name', 'last_name')->withAvg('degrees as degree', 'degree')->paginate(PAGINATION);

            } else {

                /*
                    If $state is certain state get [first name, middle name, last name] students they have
                    degrees and from this state with avarage of degrees for that students, and number of
                    students is PAGINATION
                */

                $degrees = Student::where('state', $state)->whereHas('degrees')->select('first_name', 'middle_name', 'last_name')->withAvg('degrees as degree', 'degree')->paginate(PAGINATION);

            }
        }

        return $degrees;
    }

    // *****************************************************************************************

    /*******************************************************************************************************/
}
