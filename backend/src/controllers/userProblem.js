const {getLanguageById,submitBatch,submitToken} = require("../utils/problemUtility");
const Problem = require("../models/problem");
const User = require("../models/user");
const Submission = require("../models/submission");
const SolutionVideo = require("../models/solutionVideo")


const createProblem = async (req, res) => {
  try {
    const {
      title,
      description,
      difficulty,
      tags,
      visibleTestCases,
      hiddenTestCases,
      startCode,
      referenceSolution,
    } = req.body;

    if (!title || !description || !difficulty) {
      return res.status(400).json({ message: "Basic fields missing" });
    }

    if (!referenceSolution || !Array.isArray(referenceSolution) || referenceSolution.length === 0) {
      return res.status(400).json({ message: "Reference solution required" });
    }

    if (!visibleTestCases || visibleTestCases.length === 0) {
      return res.status(400).json({ message: "Visible test cases required" });
    }

    for (const { language, completeCode } of referenceSolution) {
      const languageId = getLanguageById(language);

      if (!languageId) {
        return res.status(400).json({ message: `Invalid language: ${language}` });
      }

      const submissions = visibleTestCases.map(tc => ({
        source_code: completeCode,
        language_id: languageId,
        stdin: tc.input,
        expected_output: tc.output,
      }));

      const submitResult = await submitBatch(submissions);
      const tokens = submitResult.map(r => r.token);
      const results = await submitToken(tokens);

      for (const r of results) {
        if (r.status_id !== 3) {
          return res.status(400).json({ message: "Reference solution failed testcases" });
        }
      }
    }

    await Problem.create({
      ...req.body,
      problemCreator: req.result._id, // or req.user._id (confirm middleware)
    });

    res.status(201).json({ message: "Problem created successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


const updateProblem = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🔍 Update request received for ID:", id);
    console.log("📦 Request body:", req.body);

    if (!id) {
      return res.status(400).json({ message: "Problem ID is required" });
    }

    const existingProblem = await Problem.findById(id);
    if (!existingProblem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const {
      title,
      description,
      difficulty,
      tags,
      visibleTestCases,
      hiddenTestCases,
      startCode,
      referenceSolution,
    } = req.body;

    console.log("✅ Extracted fields:", { title, difficulty, tags });

    // ---- VALIDATION ----
    if (!referenceSolution || !Array.isArray(referenceSolution) || referenceSolution.length === 0) {
      console.log("❌ Validation failed: referenceSolution missing");
      return res.status(400).json({ message: "Reference solution required" });
    }

    if (!visibleTestCases || visibleTestCases.length === 0) {
      console.log("❌ Validation failed: visibleTestCases missing");
      return res.status(400).json({ message: "Visible test cases required" });
    }

    // ---- JUDGE VERIFICATION ----
    console.log("🧪 Starting Judge0 verification...");
    for (const { language, completeCode } of referenceSolution) {
      const languageId = getLanguageById(language);
      console.log("📝 Language:", language, "-> ID:", languageId);

      if (!languageId) {
        return res.status(400).json({ message: `Unsupported language: ${language}` });
      }

      const submissions = visibleTestCases.map(tc => ({
        source_code: completeCode,
        language_id: languageId,
        stdin: tc.input,
        expected_output: tc.output,
      }));

      console.log("📤 Submitting to Judge0:", submissions.length, "test cases");
      
      const submitResult = await submitBatch(submissions);
      console.log("📥 Judge0 response:", submitResult);
      
      const tokens = submitResult.map(r => r.token);
      const results = await submitToken(tokens);
      console.log("📊 Judge0 results:", results);

      for (const r of results) {
        if (r.status_id !== 3) {
          console.log("❌ Test failed:", r);
          return res.status(400).json({
            message: `Reference solution failed for ${language}`,
            details: r
          });
        }
      }
    }

    // ---- SAFE UPDATE ----
    console.log("💾 Saving to database...");
    const updatedProblem = await Problem.findByIdAndUpdate(
      id,
      {
        title,
        description,
        difficulty,
        tags,
        visibleTestCases,
        hiddenTestCases,
        startCode,
        referenceSolution,
      },
      { new: true, runValidators: true }
    );

    console.log("✅ Update successful!");
    res.status(200).json({
      message: "Problem updated successfully",
      problem: updatedProblem,
    });

  } catch (err) {
    console.error("❌ CRITICAL ERROR:", err); // This will show in your terminal
    console.error("Stack trace:", err.stack);
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};


const deleteProblem = async(req,res)=>{

  const {id} = req.params;
  try{
     
    if(!id)
      return res.status(400).send("ID is Missing");

   const deletedProblem = await Problem.findByIdAndDelete(id);

   if(!deletedProblem)
    return res.status(404).send("Problem is Missing");


   res.status(200).send("Successfully Deleted");
  }
  catch(err){
     
    res.status(500).send("Error: "+err);
  }
}


const getProblemById = async(req,res)=>{

  const {id} = req.params;
  try{
     
    if(!id)
      return res.status(400).send("ID is Missing");

    const getProblem = await Problem.findById(id).select('_id title description difficulty tags visibleTestCases startCode referenceSolution ');
   
    // video ka jo bhi url wagera le aao

   if(!getProblem)
    return res.status(404).send("Problem is Missing");

   const videos = await SolutionVideo.findOne({problemId:id});

   if(videos){   
    
   const responseData = {
    ...getProblem.toObject(),
    secureUrl:videos.secureUrl,
    thumbnailUrl : videos.thumbnailUrl,
    duration : videos.duration,
   } 
  
   return res.status(200).send(responseData);
   }
    
   res.status(200).send(getProblem);

  }
  catch(err){
    res.status(500).send("Error: "+err);
  }
}

const getAllProblem = async(req,res)=>{

  try{
     
    const getProblem = await Problem.find({}).select('_id title difficulty tags');

   if(getProblem.length==0)
    return res.status(404).send("Problem is Missing");


   res.status(200).send(getProblem);
  }
  catch(err){
    res.status(500).send("Error: "+err);
  }
}


const solvedAllProblembyUser =  async(req,res)=>{
   
    try{
       
      const userId = req.result._id;

      const user =  await User.findById(userId).populate({
        path:"problemSolved",
        select:"_id title difficulty tags"
      });
      
      res.status(200).send(user.problemSolved);

    }
    catch(err){
      res.status(500).send("Server Error");
    }
}


const submittedProblem = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.pid;

    // Validate inputs
    if (!problemId) {
      return res.status(400).json({ 
        error: 'Problem ID is required',
        submissions: [] 
      });
    }

   
    const submissions = await Submission.find({ 
      userId: userId, 
      problemId: problemId 
    })
    .sort({ createdAt: -1 }) 
    .lean(); 
    return res.status(200).json(submissions || []);

  } catch (err) {
    console.error('Error in submittedProblem:', err);
    
    return res.status(200).json([]);
  }
};



module.exports = {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,solvedAllProblembyUser,submittedProblem};


