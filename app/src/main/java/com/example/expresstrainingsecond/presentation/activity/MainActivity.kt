package com.example.expresstrainingsecond.presentation.activity

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.example.expresstrainingsecond.databinding.ActivityMainBinding
import com.example.expresstrainingsecond.presentation.activity.book.BookActivity

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)


        Intent(this, BookActivity::class.java).also {
            startActivity(it)
        }
    }

}