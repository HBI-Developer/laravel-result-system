<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Subject;

class StatisticsAdminController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:admin');
    }


    public function statistics()
    {
        $statistics = $this->getStatistics();

        return view("admin.statistics", $statistics);
    }


    public function getStatistics($state = 0)
    {
        $GLOBALS['state'] = $state;

        $males = Subject::with(['degrees' => function ($query) {
            $students = collect();

            if ($GLOBALS['state'] > 0) {
                $students = Student::where('gender', 1)->where('state', $GLOBALS['state'])->get();
            } else {
                $students = Student::where('gender', 1)->get();
            }

            $query->whereBelongsTo($students);
        }])->select('id', 'subject_name')->withAvg('degrees as degree', 'degree')->get();

        $females = Subject::with(['degrees' => function ($query) {
            if ($GLOBALS['state'] > 0) {
                $students = Student::where('gender', 2)->where('state', $GLOBALS['state'])->get();
            } else {
                $students = Student::where('gender', 2)->get();
            }

            $query->whereBelongsTo($students);
        }])->select('id', 'subject_name')->withAvg('degrees as degree', 'degree')->get();

        $details_statistics = collect([]);

        for ($i = 0; $i < $males->count(); $i++) {

            $male = round($males[$i]->degrees->avg('degree'), 2);

            $female = round($females[$i]->degrees->avg('degree'), 2);

            $all = round(($male + $female) / 2, 2);

            $details_statistics->push([
                "subject"   => $males[$i]->subject_name,
                "males"     => $male,
                "females"   => $female,
                "all"       => $all
            ]);
        }

        $total_males = round($details_statistics->avg('males'), 2);

        $total_females = round($details_statistics->avg('females'), 2);

        $total = round(($total_males + $total_females) / 2, 2);

        $total_statistics = collect([
            "males"     => $total_males,
            "females"   => $total_females,
            "all"       => $total
        ]);

        return compact('details_statistics', 'total_statistics');
    }
}
