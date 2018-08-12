<?php

class BMKO_Errors {

    private $errorLogPath;
    private $editorCmd;
    private $editor;
    private $vars;
    private $backtraceElements;
    private $filePath;
    private $line;
    private $message;

    public function __construct($arg, $message=false) {

        if (is_string($message)) {
            $this->message = $message;
        }

        $var = array();
        $var['mxdVar'] = $arg;

        if (is_bool($arg)) {
            $varOutPut = ($arg) ? 'TRUE' : 'FALSE';
        } else {
            $varOutPut = var_export($arg, true);
        }

        // $varOutPut = (get_magic_quotes_gpc()) ? stripslashes($varOutPut) : $varOutPut;
        $varOutPut = stripslashes($varOutPut);
        $var['originalValue'] = $arg;

        $var['strVarType'] = (is_resource($arg))
            ? 'Resource ('.get_resource_type($arg).')'
            : gettype($arg);

        if ($var['strVarType'] == 'string') {
            if ($varOutPut == "''") {
                $varOutPut = '❝❞';
            } else {
                $varOutPut = preg_replace("/^'/", '❝', $varOutPut);
                $varOutPut = preg_replace("/'$/", '❞', $varOutPut);
            }
        }

        $var['strVarOutPut'] = $varOutPut;

        $this->vars[] = $var;

        $this->errorLogPath = '/tmp/silly_arse';
        if (!is_file($this->errorLogPath)) {
            touch($this->errorLogPath);
        }
        if (!is_writeable($this->errorLogPath)) {
            chmod($this->errorLogPath, 0666);
        }

        $this->backtraceElements = debug_backtrace(false);
        $this->filePath = $this->backtraceElements[1]['file'];
        $this->line = $this->backtraceElements[1]['line'];

        $this->editor = 'atom';
        $this->editorCmd = "{$this->editor} {$this->filePath}:{$this->line}";
        $this->errorDocPath = '/Users/mkenny/Desktop/ErrorDoc.txt';

    }

    private function Indent($string, $applyLineNumbers = false) {
        $bits = explode("\n", $string);
        $last = count($bits) - 1;
        if ($last > 0) {
            if ($bits[$last] == '') {
                unset($bits[$last]);
            }
            $i = 0;
            foreach($bits as &$line) {
                if ($applyLineNumbers) {
                    $space = ($i > 0) ? '.   ' : '. ';
                    $line = ++$i.$space.$line;
                } else {
                    $space = ($i > 0) ? "\t" : '';
                    $line = $space.$line;
                    $i++;
                }
            }
            $string = implode("\n", $bits);
        }
        return $string;
    }

    public function DetailedLog($outputToErrorLog = true, $applyLineNumbers = false) {
        $n = "\n\n";
        $datetime = date('Y-m-d H:i:s');

        $output = "<log datetime='$datetime'>";
        $output .= "\n{$this->editorCmd}$n";

        if (!empty($this->message)) {
            $output .= $n
                    . "\t***" . str_repeat('*', strlen($this->message)) . "***\n"
                    . "\t** {$this->message} **\n"
                    . "\t***" . str_repeat('*', strlen($this->message)) . "***\n\n";
        }

        if (is_array($this->vars)) {
            foreach($this->vars as $var) {
                $moreInfo = ($var['strVarType'] == 'string') ? ' length="'.strlen($var['originalValue']).'"' : '';
                $output .= "\t<{$var['strVarType']}{$moreInfo}>".$this->Indent($var['strVarOutPut'], $applyLineNumbers)."</{$var['strVarType']}>$n";
            }
        } else {
            $output .= "\t<error>".$this->Indent('Nothing has been logged!', $applyLineNumbers).'</error>'.$n;
        }

        $output .= '</log>'.$n;

        if ($outputToErrorLog) {
            error_log("\n\n$output", 3, $this->errorLogPath);
        } else {
            return $output;
        }
    }

    public function SimpleLog() {
        $date = date('Y-m-d H:i:s');
        if (is_array($this->vars)) {
            error_log("[$date] {$this->vars[0]['strVarOutPut']}\n", 3, $this->errorLogPath);
        }
    }

    public function Flag() {
        $var = $this->vars[0]['mxdVar'];
        $varType = $this->vars[0]['strVarType'];
        switch($varType) {
            case 'boolean':
                $this->message = 'bol '.($var ? 'TRUE' : 'FALSE'); break;
            case 'integer':
                $this->message = 'int '.$var; break;
            case 'double':
                $this->message = 'flt '.$var; break;
            case 'string':
                $this->message = 'str '.$var; break;
            case 'array':
                $this->message = 'arr '.count($var); break;
            case 'object':
                $this->message = 'obj '; break;
            case 'resource':
                $this->message = 'res '.get_resource_type($var); break;
            case 'NULL':
                $this->message = 'NULL'; break;
            case 'unknown type':
                $this->message = '??? '; break;
        }
        $this->filePath = $this->backtraceElements[1]['file'];
        $this->line = $this->backtraceElements[1]['line'];
        $datetime = date('Y-m-d H:i:s');
        $output = "
          / * / * / * / * / * / * / * / * / * / * / * / * / * / * /
         / * / * / * / * / * / * / * / * / * / * / * / * / * / * /
        / * / * / * / * / * / * / * / * / * / * / * / * / * / * /           {$this->message}
       / * / * / * / * / * / * / * / * / * / * / * / * / * / * /           LINE: {$this->line}
      / * / * / * / * / * / * / * / * / * / * / * / * / * / * /
     / * / {$this->editor} {$this->line} {$this->filePath}
    / * / $datetime";

        error_log("\n\n$output\n\n", 3, $this->errorLogPath);
    }

    public function Pre() {
        $message = htmlentities($this->message, ENT_QUOTES, 'UTF-8');

        /** THIS LINE NEEDS CHANGING */

        $oot = $this->DetailedLog(false);
        $contents = htmlentities($oot, ENT_QUOTES, 'UTF-8');
        $output = '<pre>';
        if ($message) {
            $output .= '<strong>'.$message.'</strong>'."\n";
        }
        $output .= $contents;
        $output .= '</pre>';
        echo $output;
    }

    public function Backtrace($returnTheValue = false) {

        $backtrace = '';

        foreach($this->backtraceElements as $k => $value){
            if ($k>0) {
                $function = (isset($value['class']) ? $value['class'].$value['type'] : '') . $value['function'].'()';
                if ((isset($value['line']) && isset($value['file']))) {
                    $called = "- {$value['line']} {$value['file']}";
                    $backtrace .= "  $k. $function\n     $called\n\n";
                } else {
                    $backtrace .= "  $k. $function\n\n";
                }
            }
        }

        $datetime = date('Y-m-d H:i:s');
        $output = "<backtrace datetime='$datetime'> ".$this->message;
            if (is_array($this->vars))
            $output .= "\n\n";
            $output .= $backtrace;
            $output .= "\n";
        $output .= "</backtrace>\n\n";

        if ($returnTheValue) {
            return $output;
        } else {
            error_log("\n\n$output", 3, $this->errorLogPath);
        }
    }

    // Echos output to bash output
    public static function Spit($spit) {
        $spit = var_export($spit, 1);
        echo "\n$spit\n\n";
    }

}

function _el() {

    $arguments = func_get_args();

    if (count($arguments) == 2 && is_string($arguments[1])) {

        $bmkoError = new BMKO_Errors($arguments[0], $arguments[1]);
        $bmkoError->DetailedLog();

    } else {

        foreach ($arguments as $argument) {
            $bmkoError = new BMKO_Errors($argument);
            $bmkoError->DetailedLog();
        }

    }
}

function _le($message='') {
    $bmkoError = new BMKO_Errors($message);
    $bmkoError->SimpleLog();
}

function _ef($message=null) {
    $bmkoError = new BMKO_Errors($message);
    $bmkoError->Flag();
}

function _bt() {
    $args = func_get_args();
    $bmkoError = new BMKO_Errors($args);
    $bmkoError->Backtrace();
}

function pre() {

    $arguments = func_get_args();

    if (count($arguments) == 2 && is_string($arguments[1])) {

        $bmkoError = new BMKO_Errors($arguments[0], $arguments[1]);
        $bmkoError->Pre();

    } else {

        foreach ($arguments as $argument) {
            $bmkoError = new BMKO_Errors($argument);
            $bmkoError->Pre();
        }

    }

}

function spit($spit='') {
    BMKO_Errors::Spit($spit);
}
