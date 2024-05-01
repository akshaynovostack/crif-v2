exports.getSettingValue = async (settingName) => {
    try{
        let settingValue = await knexSqlDb.from("settings").where({setting_name:settingName});
        return {settingValue};
    }
    catch(e){
        return {error:e};
    }
}